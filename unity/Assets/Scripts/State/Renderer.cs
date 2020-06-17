using System.Collections.Generic;
using UniTEA;
using UnityEngine;

namespace State
{
    public class Renderer : MonoBehaviour, IRenderer<Model, Msg>
    {
        [SerializeField] private GameObject isLoading;

        public void Start()
        {
            DontDestroyOnLoad(gameObject);
        }

        public void Init(Dispatcher<Msg> dispatcher) { }

        public void Render(Model model)
        {
            SceneRender(model.currentModel);
            isLoading.gameObject.SetActive(model.isLoad);
        }

        private static void SceneRender(IState subState)
        {
            switch (subState)
            {
                case StartScene.Model subModel:
                {
                    var renderer = FindObjectOfType<StartScene.Renderer>();
                    renderer.Render(subModel);
                    break;
                }
                case PlayScene.Model subModel:
                {
                    var renderer = FindObjectOfType<PlayScene.Renderer>();
                    renderer.Render(subModel);
                    break;
                }
            }
        }
    }
}
