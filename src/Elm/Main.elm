module Main exposing (main)

import Browser
import Calc
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Parser


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
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
    | Run


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Input str ->
            ( { model | input = str }, Cmd.none )

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
    div []
        [ div [] [ input [ onInput Input, value model.input ] [] ]
        , div
            []
            (List.range 0 9
                |> List.map String.fromInt
                |> List.map (\x -> button [ onClick <| Input (model.input ++ x) ] [ text x ])
            )
        , div
            []
            ([ "+", "-", "*", "/", "(", ")" ]
                |> List.map (\x -> button [ onClick <| Input (model.input ++ x) ] [ text x ])
            )
        , div
            []
            [ button [ onClick Run ] [ text "=" ]
            , button [ onClick <| Input "" ] [ text "C" ]
            ]
        ]
