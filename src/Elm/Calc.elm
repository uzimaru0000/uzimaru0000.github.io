module Calc exposing (AST(..), parser, run)

import Parser exposing ((|.), (|=), Parser)


type AST
    = Add AST AST
    | Sub AST AST
    | Mul AST AST
    | Div AST AST
    | Number Float
    | Abs AST
    | Sin AST
    | Cos AST
    | Tan AST


type BuildingAST
    = Seed (AST -> AST -> AST)
    | AST_ AST
    | LeftBracket
    | RightBracket


type alias BuildState =
    { stack : List BuildingAST
    , result : List AST
    }


run : AST -> Float
run ast =
    case ast of
        Number n ->
            n

        Abs subTree ->
            Basics.abs (run subTree)

        Sin subTree ->
            Basics.sin (run subTree)

        Cos subTree ->
            Basics.cos (run subTree)

        Tan subTree ->
            Basics.tan (run subTree)

        Add l r ->
            run l + run r

        Sub l r ->
            run l - run r

        Mul l r ->
            run l * run r

        Div l r ->
            run l / run r


infix_ : BuildingAST -> Int
infix_ t =
    case t of
        Seed s ->
            infix_ (AST_ <| s (Number 0) (Number 0))

        AST_ (Add _ _) ->
            2

        AST_ (Sub _ _) ->
            2

        AST_ (Mul _ _) ->
            3

        AST_ (Div _ _) ->
            3

        _ ->
            0


parser : Parser AST
parser =
    Parser.loop { stack = [], result = [] } <|
        \state ->
            Parser.succeed identity
                |. Parser.spaces
                |= Parser.oneOf
                    [ funcParser
                        |> Parser.map (\f -> Parser.Loop { state | result = f :: state.result })
                    , operatorParser
                        |> Parser.backtrackable
                        |> Parser.map (\op -> operator op state)
                        |> Parser.andThen
                            (\res ->
                                case res of
                                    Ok st ->
                                        Parser.succeed <| Parser.Loop st

                                    Err msg ->
                                        Parser.problem msg
                            )
                    , valueParser
                        |> Parser.map (\v -> Parser.Loop { state | result = v :: state.result })
                    , leftBracket
                        |> Parser.map (\lb -> Parser.Loop { state | stack = lb :: state.stack })
                    , rightBracket
                        |> Parser.backtrackable
                        |> Parser.map (\_ -> bracket state.stack state.result)
                        |> Parser.map (Result.map Parser.succeed)
                        |> Parser.andThen (Result.withDefault (Parser.problem "error"))
                        |> Parser.map Parser.Loop
                    , Parser.succeed ()
                        |> Parser.map (\_ -> List.foldl (\st -> Result.andThen (operatorHelper st)) (Ok state.result) state.stack)
                        |> Parser.andThen
                            (\res ->
                                case res of
                                    Ok (hd :: []) ->
                                        Parser.succeed hd

                                    _ ->
                                        Parser.problem "error"
                            )
                        |> Parser.map Parser.Done
                    ]


operator : BuildingAST -> BuildState -> Result String BuildState
operator op { stack, result } =
    case stack of
        hd :: tl ->
            if infix_ hd < infix_ op then
                Ok { stack = op :: stack, result = result }

            else
                case operatorHelper hd result of
                    Ok res ->
                        operator op { stack = tl, result = res }

                    Err msg ->
                        Err msg

        _ ->
            Ok { stack = op :: stack, result = result }


operatorHelper : BuildingAST -> List AST -> Result String (List AST)
operatorHelper op result =
    case result of
        f :: s :: tl ->
            case op of
                Seed seed ->
                    Ok <| seed s f :: tl

                _ ->
                    Err "apply operator error"

        _ ->
            Err "apply operator error"


bracket : List BuildingAST -> List AST -> Result String BuildState
bracket stack result =
    case stack of
        hd :: tl ->
            case hd of
                LeftBracket ->
                    Ok <| { stack = tl, result = result }

                Seed _ ->
                    operatorHelper hd result |> Result.andThen (bracket tl)

                _ ->
                    Err "Parse Error"

        [] ->
            Err "Parse Error"


valueParser : Parser AST
valueParser =
    Parser.oneOf
        [ num
        , pi
        ]


funcParser : Parser AST
funcParser =
    Parser.oneOf
        [ abs
        , sin
        , cos
        , tan
        ]


operatorParser : Parser BuildingAST
operatorParser =
    Parser.oneOf
        [ add
        , sub
        , mul
        , div
        ]


add : Parser BuildingAST
add =
    Parser.succeed (Seed Add)
        |. Parser.symbol "+"


sub : Parser BuildingAST
sub =
    Parser.succeed (Seed Sub)
        |. Parser.symbol "-"


mul : Parser BuildingAST
mul =
    Parser.succeed (Seed Mul)
        |. Parser.oneOf [ Parser.symbol "×", Parser.symbol "*" ]


div : Parser BuildingAST
div =
    Parser.succeed (Seed Div)
        |. Parser.oneOf [ Parser.symbol "÷", Parser.symbol "/" ]


num : Parser AST
num =
    Parser.oneOf
        [ Parser.succeed Number
            |= Parser.float
        , Parser.succeed (toFloat >> Number)
            |= Parser.int
        , Parser.succeed Number
            |. negative
            |= (Parser.float |> Parser.map ((*) -1))
        , Parser.succeed (toFloat >> Number)
            |. negative
            |= (Parser.int |> Parser.map ((*) -1))
        ]


negative : Parser ()
negative =
    Parser.succeed ()
        |. Parser.symbol "-"


pi : Parser AST
pi =
    Parser.succeed (Number Basics.pi)
        |. Parser.keyword "PI"


func : String -> (AST -> AST) -> Parser AST
func name f =
    Parser.succeed f
        |. Parser.keyword name
        |. Parser.symbol "("
        |. Parser.spaces
        |= parser
        |. Parser.spaces
        |. Parser.symbol ")"


abs : Parser AST
abs =
    func "abs" Abs


sin : Parser AST
sin =
    func "sin" Sin


cos : Parser AST
cos =
    func "cos" Cos


tan : Parser AST
tan =
    func "tan" Tan


leftBracket : Parser BuildingAST
leftBracket =
    Parser.succeed LeftBracket
        |. Parser.symbol "("


rightBracket : Parser BuildingAST
rightBracket =
    Parser.succeed RightBracket
        |. Parser.symbol ")"
