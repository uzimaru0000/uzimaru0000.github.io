public enum GameState
{
    Start,
    Playing,
    GameOver,
    Goal
}

public struct Model
{
    public GameState state;

    public Model(Model old)
    {
        this = old;
    }
}
