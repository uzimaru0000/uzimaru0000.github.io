using System.Collections;
using System.Collections.Generic;
using UniTEA;
using UniTEA.Utils;
using UnityEngine;
using UnityEngine.PlayerLoop;

namespace State.PlayScene 
{
    public enum GameState
    {
        Start,
        Play,
        GameOver,
        Goal
    }
    
    public struct Model : IState
    {
        public bool isPlay;
        public GameState state;

        public Model(Model old)
        {
            this = old;
        }
    }

    public enum Msg
    {
        ChangeState
    }
    
    public class ChangeStateMsg : OneValueMsg<Msg, GameState>
    {
        public ChangeStateMsg(GameState value) : base(value) { }
        public override Msg GetMessage() => Msg.ChangeState;
    }

    public class Updater : IUpdater<Model, Msg>
    {
        public (Model, Cmd<Msg>) Update(IMessenger<Msg> msg, Model model)
        {
            switch (msg)
            {
                case ChangeStateMsg changeStateMsg:
                    return (new Model(model)
                    {
                        state = changeStateMsg.value,
                        isPlay = changeStateMsg.value == GameState.Play
                    }, Cmd<Msg>.none);
            }
            return (model, Cmd<Msg>.none);
        }
    }

    public class StateManager : MonoBehaviour
    {
        public static (Model, Cmd<Msg>) Init() => (new Model(), Cmd<Msg>.none);
        
        [SerializeField] private Renderer renderer;
        [SerializeField] private CollisionEffect gameOverArea;
        [SerializeField] private ColliderEffect goadArea;
        
        void Start()
        {
            renderer.Init(msg => State.StateManager.instance.Dispatch(new PlayMsg(msg)));

            var sub = Sub<IMessenger<Msg>>.batch(new []
            {
                gameOverArea.ToSub().Map(_ => new ChangeStateMsg(GameState.GameOver) as IMessenger<Msg>),
                goadArea.ToSub().Map(_ => new ChangeStateMsg(GameState.Goal) as IMessenger<Msg>)
            });
            sub.OnWatch += msg => State.StateManager.instance.Dispatch(new PlayMsg(msg));
        }
    }
}
