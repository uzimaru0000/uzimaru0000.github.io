using System;
using UniTEA;
using UnityEngine;
using UnityEngine.UI;

namespace State.PlayScene
{
    public class Renderer : MonoBehaviour, IRenderer<Model, Msg>
    {
        [SerializeField] private GameObject startPanel;
        [SerializeField] private GameObject playPanel;
        [SerializeField] private GameObject gameOverPanel;
        [SerializeField] private GoalPanel goalPanel;
        [SerializeField] private Button playBtn;
        [SerializeField] private Button retryBtn;
        [SerializeField] private Text coinText;
        [SerializeField] private CameraController _cameraController;
        [SerializeField] private CharactorController _egg;
        [SerializeField] private Transform initPos;
        
        public void Init(Dispatcher<Msg> dispatcher)
        {
            playBtn.onClick.AddListener(() => dispatcher(new ChangeStateMsg(GameState.Play)));
            retryBtn.onClick.AddListener(() => dispatcher(new ChangeStateMsg(GameState.Start)));
            goalPanel.Init(dispatcher);
        }

        public void Render(Model model)
        {
            coinText.text = $"x {model.coin}";
            startPanel.SetActive(model.state == GameState.Start);
            playPanel.SetActive(model.state == GameState.Play);
            gameOverPanel.SetActive(model.state == GameState.GameOver);
            goalPanel.Render(model);
            _egg.enabled = model.state == GameState.Play;
            
            switch (model.state)
            {
                case GameState.Start:
                    _egg.transform.position = initPos.position;
                    _egg.Reset();
                    _cameraController.Reset();
                    break;
            }
        }
    }

}