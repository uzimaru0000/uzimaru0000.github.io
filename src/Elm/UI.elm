module UI exposing (..)

import Css
import Css.Global as Css
import Html.Styled as Html exposing (Attribute, Html, styled)
import Html.Styled.Attributes as Html


button : List (Attribute msg) -> List (Html msg) -> Html msg
button =
    styled
        Html.button
        [ Css.fontSize (Css.px 24)
        , Css.textAlign Css.center
        , Css.border Css.zero
        , Css.padding Css.zero
        ]


input : List (Attribute msg) -> List (Html msg) -> Html msg
input =
    styled
        Html.input
        [ Css.width (Css.pct 100)
        , Css.padding2 Css.zero (Css.rem 1)
        , Css.fontSize (Css.px 48)
        , Css.textAlign Css.right
        , Css.border Css.zero
        , Css.property "background" "var(--gray)"
        , Css.property "color" "var(--text)"
        ]


keypad : List (Attribute msg) -> List (Html msg) -> Html msg
keypad =
    styled
        Html.div
        [ Css.property "display" "grid"
        , Css.property "grid-template-rows" "repeat(5, 1fr)"
        , Css.property "grid-template-columns" "repeat(4, 1fr)"
        , Css.property "gap" "1px"
        ]


backgroundColorMain : Attribute msg
backgroundColorMain =
    Html.css
        [ Css.property "background" "var(--main)"
        , Css.property "color" "var(--text)"
        ]


backgroundColorGray50 : Attribute msg
backgroundColorGray50 =
    Html.css
        [ Css.property "background" "var(--gray50)"
        , Css.property "color" "var(--text)"
        ]


backgroundColorGray25 : Attribute msg
backgroundColorGray25 =
    Html.css
        [ Css.property "background" "var(--gray25)"
        ]
