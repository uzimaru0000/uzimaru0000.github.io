module Main exposing (main)

import Browser
import Calc
import Css
import Css.Global as Css
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Parser
import UI


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view >> toUnstyled
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { input : String
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { input = "" }, Cmd.none )


type Msg
    = Input String
    | Clear
    | Insert String
    | Run


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Input str ->
            ( { model | input = str }, Cmd.none )

        Clear ->
            ( { model | input = "" }, Cmd.none )

        Insert str ->
            ( { model | input = model.input ++ str }, Cmd.none )

        Run ->
            ( { model
                | input =
                    model.input
                        |> Parser.run Calc.parser
                        |> Result.toMaybe
                        |> Maybe.map Calc.run
                        |> Maybe.map String.fromFloat
                        |> Maybe.withDefault ""
              }
            , Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


view : Model -> Html Msg
view model =
    div
        [ css
            [ Css.height (Css.pct 100)
            , Css.displayFlex
            , Css.flexDirection Css.column
            ]
        ]
        [ UI.input [ onInput Input, value model.input, css [ Css.flexGrow (Css.int 1) ] ] []
        , UI.keypad
            [ css [ Css.flexGrow (Css.int 5) ]
            ]
            [ UI.button [ onClick Clear, UI.backgroundColorGray50 ] [ text "C" ]
            , UI.button [ onClick <| Insert "(", UI.backgroundColorGray50 ] [ text "(" ]
            , UI.button [ onClick <| Insert ")", UI.backgroundColorGray50 ] [ text ")" ]
            , UI.button [ onClick <| Insert "÷", UI.backgroundColorMain ] [ text "÷" ]
            , UI.button [ onClick <| Insert "7", UI.backgroundColorGray25 ] [ text "7" ]
            , UI.button [ onClick <| Insert "8", UI.backgroundColorGray25 ] [ text "8" ]
            , UI.button [ onClick <| Insert "9", UI.backgroundColorGray25 ] [ text "9" ]
            , UI.button [ onClick <| Insert "×", UI.backgroundColorMain ] [ text "×" ]
            , UI.button [ onClick <| Insert "4", UI.backgroundColorGray25 ] [ text "4" ]
            , UI.button [ onClick <| Insert "5", UI.backgroundColorGray25 ] [ text "5" ]
            , UI.button [ onClick <| Insert "6", UI.backgroundColorGray25 ] [ text "6" ]
            , UI.button [ onClick <| Insert "-", UI.backgroundColorMain ] [ text "-" ]
            , UI.button [ onClick <| Insert "1", UI.backgroundColorGray25 ] [ text "1" ]
            , UI.button [ onClick <| Insert "2", UI.backgroundColorGray25 ] [ text "2" ]
            , UI.button [ onClick <| Insert "3", UI.backgroundColorGray25 ] [ text "3" ]
            , UI.button [ onClick <| Insert "+", UI.backgroundColorMain ] [ text "+" ]
            , UI.button
                [ onClick <| Insert "0"
                , css [ Css.property "grid-column" "1 / 3" ]
                , UI.backgroundColorGray25
                ]
                [ text "0" ]
            , UI.button [ onClick <| Insert ".", UI.backgroundColorGray25 ] [ text "." ]
            , UI.button [ onClick Run, UI.backgroundColorMain ] [ text "=" ]
            ]
        ]
