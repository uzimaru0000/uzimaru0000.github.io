using UniTEA;
using UnityEngine;

namespace State.StartScene
{
    public struct Model : IState { }

    public enum Msg
    {
        LoadScene,
        LoadedScene
    }

    public class LoadSceneMsg : IMessenger<Msg>
    {
        public Msg GetMessage() => Msg.LoadScene;
    }

    public class LoadedSceneMsg : IMessenger<Msg>
    {
        public Msg GetMessage() => Msg.LoadedScene;
    }
    
    public class Updater : IUpdater<Model, Msg>
    {
        public (Model, Cmd<Msg>) Update(IMessenger<Msg> msg, Model model)
        {
            switch (msg)
            {
                case LoadSceneMsg _:
                    return (model, LoadSceneCmd.LoadScene<Msg>(State.Msg.Play, 2));
            }
            return (model, Cmd<Msg>.none);
        }
    }
    
    public class StateManager : MonoBehaviour
    {
        [SerializeField] private Renderer renderer;

        public static (Model, Cmd<Msg>) Init() => (new Model(), Cmd<Msg>.none);

        void Start()
        {
            renderer.Init(msg => State.StateManager.instance.Dispatch(new StartMsg(msg)));
        }
    }
}