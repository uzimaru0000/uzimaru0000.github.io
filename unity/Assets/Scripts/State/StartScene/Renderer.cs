using UniTEA;
using UnityEngine;
using UnityEngine.UI;

namespace State.StartScene
{
    public class Renderer : MonoBehaviour, IRenderer<Model, Msg>
    {
        [SerializeField] private Button startButton; 
        
        public void Init(Dispatcher<Msg> dispatcher)
        {
            startButton.onClick.AddListener(() => dispatcher(new LoadSceneMsg()));
        }

        public void Render(Model model)
        {
        }
    }
}