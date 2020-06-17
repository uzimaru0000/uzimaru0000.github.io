using System.Collections;
using System.Collections.Generic;
using System.Linq;
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
        public int coin;

        public Model(Model old)
        {
            this = old;
        }
    }

    public enum Msg
    {
        ChangeState,
        GetCoin,
        NoOp
    }
    
    public class ChangeStateMsg : OneValueMsg<Msg, GameState>
    {
        public ChangeStateMsg(GameState value) : base(value) { }
        public override Msg GetMessage() => Msg.ChangeState;
    }

    public class GetCoinMsg : IMessenger<Msg>
    {
        public Msg GetMessage() => Msg.GetCoin;
    }

    public class NoOpMsg : IMessenger<Msg>
    {
        public Msg GetMessage() => Msg.NoOp;
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
                        isPlay = changeStateMsg.value == GameState.Play,
                        coin = changeStateMsg.value == GameState.Start ? 0 : model.coin
                    }, Cmd<Msg>.none);
                case GetCoinMsg _:
                    return (new Model(model)
                    {
                        coin = model.coin + 1
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
        [SerializeField] private List<Coin> _coins;
        
        void Start()
        {
            renderer.Init(msg => State.StateManager.instance.Dispatch(new PlayMsg(msg)));

            var sub = Sub<IMessenger<Msg>>.batch(new []
            {
                gameOverArea.ToSub().Map(_ => new ChangeStateMsg(GameState.GameOver) as IMessenger<Msg>),
                goadArea.ToSub().Map(_ => new ChangeStateMsg(GameState.Goal) as IMessenger<Msg>)
            }.Concat(_coins.Select(x =>
                x.ToSub().Map((val) =>
                {
                    var (coin, other) = val;
                    if (!other.transform.parent?.GetComponent<CharactorController>())
                    {
                        return new NoOpMsg() as IMessenger<Msg>;
                    }
                    
                    Destroy(coin.gameObject);
                    return new GetCoinMsg() as IMessenger<Msg>;
                })
            )).ToArray());
            sub.OnWatch += msg => State.StateManager.instance.Dispatch(new PlayMsg(msg));
        }
    }
}
