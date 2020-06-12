using System;
using UniTEA;
using UnityEngine;
using UI = UnityEngine.UI;

public class Renderer : MonoBehaviour, IRenderer<Model, Msg>
{
    [SerializeField] private CameraController cameraController;
    [SerializeField] private CharactorController egg;
    [SerializeField] private Transform startPos;
    [SerializeField] private UI.Button playBtn;
    [SerializeField] private UI.Button retryBtn;
    [SerializeField] private GameObject panel;

    public void Init(Dispatcher<Msg> dispatcher)
    {
        playBtn.onClick.AddListener(() => dispatcher(new PlayMsg()));
        retryBtn.onClick.AddListener(() => dispatcher(new RetryMsg()));
    }

    public void Render(Model model)
    {
        switch (model.state)
        {
            case GameState.Start:
                egg.enabled = false;
                egg.Reset();
                egg.transform.position = startPos.position;
                cameraController.Reset();
                panel.SetActive(true);
                playBtn.gameObject.SetActive(true);
                retryBtn.gameObject.SetActive(false);        
                break;
            case GameState.GameOver:
                egg.enabled = false;
                panel.SetActive(true);
                playBtn.gameObject.SetActive(false);        
                retryBtn.gameObject.SetActive(true);
                break;
            case GameState.Playing:
                egg.enabled = true;
                panel.SetActive(false);
                playBtn.gameObject.SetActive(false);        
                retryBtn.gameObject.SetActive(false);        
                break;
            case GameState.Goal:
                egg.enabled = false;
                panel.SetActive(true);
                retryBtn.gameObject.SetActive(true);
                break;
        } 
    }
}
