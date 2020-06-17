using UnityEngine;
using UniTEA;
using UnityEngine.UI;

namespace State.PlayScene
{
    public class GoalPanel : MonoBehaviour, IRenderer<Model, Msg>
    {
        [SerializeField] private Button nextButton;
        [SerializeField] private Button retryButton;
        
        public void Init(Dispatcher<Msg> dispatcher)
        {
            retryButton.onClick.AddListener(() => dispatcher(new ChangeStateMsg(GameState.Start)));
        }

        public void Render(Model model)
        {
            gameObject.SetActive(model.state == GameState.Goal);
            nextButton.gameObject.SetActive(false);
        }
    }
}