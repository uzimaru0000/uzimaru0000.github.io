using UniTEA;
using UnityEngine;
using UnityEngine.UI;

namespace State.PlayScene
{
    public class Renderer : MonoBehaviour, IRenderer<Model, Msg>
    {
        [SerializeField] private GameObject startPanel;
        [SerializeField] private GameObject retryPanel;
        [SerializeField] private Button playBtn;
        [SerializeField] private Button retryBtn;
        [SerializeField] private CameraController _cameraController;
        [SerializeField] private CharactorController _egg;
        [SerializeField] private Transform initPos;
        
        public void Init(Dispatcher<Msg> dispatcher)
        {
            playBtn.onClick.AddListener(() => dispatcher(new ChangeStateMsg(GameState.Play)));
            retryBtn.onClick.AddListener(() => dispatcher(new ChangeStateMsg(GameState.Start)));
        }

        public void Render(Model model)
        {
            switch (model.state)
            {
                case GameState.Start:
                    _egg.enabled = false;
                    _egg.transform.position = initPos.position;
                    _egg.Reset();
                    _cameraController.Reset();
                    startPanel.SetActive(true);
                    retryPanel.SetActive(false);
                    break;
                case GameState.Play:
                    _egg.enabled = true;
                    startPanel.SetActive(false);
                    retryPanel.SetActive(false);
                    break;
                case GameState.GameOver:
                    _egg.enabled = false;
                    startPanel.SetActive(false);
                    retryPanel.SetActive(true);
                    break;
                case GameState.Goal:
                    _egg.enabled = false;
                    startPanel.SetActive(false);
                    retryPanel.SetActive(true);
                    break;
            }
        }
    }

}