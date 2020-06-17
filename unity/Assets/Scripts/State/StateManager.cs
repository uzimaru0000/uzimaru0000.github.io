using System;
using UnityEngine;
using UniTEA;
using UniTEA.Utils;

namespace State
{

    public struct Model
    {
        public IState currentModel;
        public bool isLoad;

        public Model(Model old)
        {
            this = old;
        }
    }

    public enum Msg
    {
        Start,
        Play,
        Result,
        LoadedScene,
        Loading
    }

    public class StartMsg : OneValueMsg<Msg, IMessenger<StartScene.Msg>>
    {
        public StartMsg(IMessenger<StartScene.Msg> value) : base(value)
        {
        }

        public override Msg GetMessage() => Msg.Start;
    }

    public class PlayMsg : OneValueMsg<Msg, IMessenger<PlayScene.Msg>>
    {
        public PlayMsg(IMessenger<PlayScene.Msg> value) : base(value) { }

        public override Msg GetMessage() => Msg.Play;
    }

    public class LoadedSceneMsg : OneValueMsg<Msg, Msg>
    {
        public LoadedSceneMsg(Msg value) : base(value) { }
        public override Msg GetMessage() => Msg.LoadedScene;
    }
    
    public class LoadingMsg : IMessenger<Msg>
    {
        public Msg GetMessage() => Msg.Loading;
    }

    class Updater : IUpdater<Model, Msg>
    {
        public (Model, Cmd<Msg>) Update(IMessenger<Msg> msg, Model model)
        {
            switch (msg)
            {
                case StartMsg subMsg:
                {
                    if (model.currentModel is StartScene.Model subModel)
                    {
                        var updater = new StartScene.Updater();
                        var (newModel, cmd) = updater.Update(subMsg.value, subModel);
                        return (
                            new Model(model) {currentModel = newModel},
                            new Cmd<Msg>(d => cmd.exec(m => d(new StartMsg(m))))
                        );
                    }
                    break;
                }
                case PlayMsg subMsg:
                {
                    if (model.currentModel is PlayScene.Model subModel)
                    {
                       var updater = new PlayScene.Updater();
                       var (newModel, cmd) = updater.Update(subMsg.value, subModel);
                       return (
                           new Model(model) {currentModel = newModel},
                           new Cmd<Msg>(d => cmd.exec(m => d(new PlayMsg(m))))
                       );
                    }
                    break;
                }
                case LoadedSceneMsg loadedSceneMsg:
                {
                    switch (loadedSceneMsg.value)
                    {
                        case Msg.Start:
                        {
                            var (subModel, subCmd) = StartScene.StateManager.Init();
                            return (
                                new Model(model)
                                {
                                    isLoad = false,
                                    currentModel = subModel
                                },
                                new Cmd<Msg>(d => subCmd.exec(m => d(new StartMsg(m))))
                            );
                        }
                        case Msg.Play:
                        {
                            var (subModel, subCmd) = PlayScene.StateManager.Init();
                            return (
                                new Model(model)
                                {
                                    isLoad = false,
                                    currentModel = subModel
                                },
                                new Cmd<Msg>(d => subCmd.exec(m => d(new PlayMsg(m))))
                            );
                        }
                        case Msg.Result:
                            break;
                    }
                    
                    return (new Model(model) {isLoad = false}, Cmd<Msg>.none);
                }
                case LoadingMsg _:
                    return (new Model(model) {isLoad = true}, Cmd<Msg>.none);
            }

            return (model, Cmd<Msg>.none);
        }
    }

    public class StateManager : MonoBehaviour
    {
        public static UniTEA<Model, Msg> instance;

        [SerializeField] private Renderer renderer;

        void Start()
        {
            DontDestroyOnLoad(gameObject);

            instance = new UniTEA<Model, Msg>(
                () => (new Model {isLoad = true}, LoadSceneCmd.LoadScene<Msg>(Msg.Start, 1)),
                new Updater(),
                renderer,
                _ => Sub<IMessenger<Msg>>.none
            );
        }
    }
}
