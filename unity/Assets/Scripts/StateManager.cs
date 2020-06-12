using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UniTEA;

public class StateManager : MonoBehaviour
{
    private UniTEA<Model, Msg> _uniTea;

    [SerializeField] private Renderer renderer;
    [SerializeField] private CollisionEffect _gameOverArea;
    [SerializeField] private ColliderEffect _goalArea;
    
    void Start()
    {
        _uniTea = new UniTEA<Model, Msg>(
            () => (new Model {state = GameState.Start}, Cmd<Msg>.none),
            new Updater(),
            renderer,
            model => Sub<IMessenger<Msg>>.batch(new []
            {
                _gameOverArea.ToSub().Map(_ => new GameOverMsg() as IMessenger<Msg>),
                _goalArea.ToSub().Map(_ => new GoalMsg() as IMessenger<Msg>)
            })
        );
    }
}

class Updater : IUpdater<Model, Msg>
{
    public (Model, Cmd<Msg>) Update(IMessenger<Msg> msg, Model model)
    {
        switch (msg)
        {
            case GameOverMsg gameOverMsg:
                return (new Model(model) {state = GameState.GameOver}, Cmd<Msg>.none);
            case GoalMsg goalMsg:
                return (new Model(model) {state = GameState.Goal}, Cmd<Msg>.none);
            case PlayMsg playMsg:
                return (new Model(model) {state = GameState.Playing}, Cmd<Msg>.none);
            case RetryMsg retryMsg:
                return (new Model(model) {state = GameState.Start}, Cmd<Msg>.none);
        }

        return (model, Cmd<Msg>.none);
    }
}
