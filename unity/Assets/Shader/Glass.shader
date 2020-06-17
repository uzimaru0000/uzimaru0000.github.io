Shader "Unlit/Glass"
{
    Properties
    {
        [PerRendererData] _MainTex("Texture", 2D) = "white" {}
        _Blur("Blur", Float) = 10
    }
    SubShader
    {

        Tags{ "Queue" = "Transparent" }

        GrabPass
        {   
        }

        Pass
        {
            CGPROGRAM

            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                fixed4 color : COLOR;
            };

            struct v2f
            {
                float4 grabPos : TEXCOORD0;
                float4 pos : SV_POSITION;
                float4 color : COLOR;
            };
            
            v2f vert(appdata v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.grabPos = ComputeGrabScreenPos(o.pos);
                o.color = v.color;
                return o;
            }
            
            sampler2D _GrabTexture;
            fixed4 _GrabTexture_TexelSize;   
            
            float _Blur;

            half4 frag(v2f i) : SV_Target
            {
                float blur = max(1, _Blur); 
                
                fixed4 col = fixed4(0, 0, 0, 0);
                float weight_sum = 0; 
                
                [loop]
                for (float x = -blur; x <= blur; x += 1)
                {
                    float d = abs(x / blur);
                    float weight = exp(-0.5 * pow(d, 2) * 5.0);
                    weight_sum += weight;
                    col += tex2Dproj(_GrabTexture, i.grabPos + float4(x * _GrabTexture_TexelSize.x, 0, 0, 0)) * weight * i.color;
                }
                
                return col / weight_sum;
            }
            ENDCG
        }
        
        GrabPass
        {   
        }

        Pass
        {
            CGPROGRAM

            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                fixed4 color : COLOR;
            };

            struct v2f
            {
                float4 grabPos : TEXCOORD0;
                float4 pos : SV_POSITION;
                float4 color : COLOR;
            };

            v2f vert(appdata v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.grabPos = ComputeGrabScreenPos(o.pos);
                o.color = v.color;
                return o;
            }
            
            sampler2D _GrabTexture;
            fixed4 _GrabTexture_TexelSize;   
            
            float _Blur;

            half4 frag(v2f i) : SV_Target
            {
                float blur = max(1, _Blur); 
                
                fixed4 col = fixed4(0, 0, 0, 0);
                float weight_sum = 0; 
                
                [loop]
                for (float y = -blur; y <= blur; y += 1)
                {
                    float d = abs(y / blur);
                    float weight = exp(-0.5 * pow(d, 2) * 5.0);
                    weight_sum += weight;
                    col += tex2Dproj(_GrabTexture, i.grabPos + float4(0, y * _GrabTexture_TexelSize.y, 0, 0)) * weight * i.color;
                }
                
                return col / weight_sum;
            }
            ENDCG
        }
    }
}
