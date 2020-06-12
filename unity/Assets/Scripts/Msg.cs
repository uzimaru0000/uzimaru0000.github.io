using UniTEA;

public enum Msg
{
    Play,
    GameOver,
    Goal,
    Retry,
}

public class GameOverMsg : IMessenger<Msg>
{
    public Msg GetMessage() => Msg.GameOver;
}

public class GoalMsg : IMessenger<Msg>
{
    public Msg GetMessage() => Msg.Goal;
}

public class PlayMsg : IMessenger<Msg>
{
    public Msg GetMessage() => Msg.Play;
}

public class RetryMsg : IMessenger<Msg>
{
    public Msg GetMessage() => Msg.Retry;
}
