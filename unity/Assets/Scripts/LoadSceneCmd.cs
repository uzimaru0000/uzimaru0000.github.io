using System.Collections;
using System.Collections.Generic;
using State;
using UniTEA;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LoadSceneCmd : MonoBehaviour
{
    public static Cmd<T> LoadScene<T>(Msg scene, int sceneID) where T : struct
    {
        var async = SceneManager.LoadSceneAsync(sceneID);
        async.allowSceneActivation = false;
        _sceneQueue.Enqueue(async);
        
        return new Cmd<T>(d =>
        {
            StateManager.instance?.Dispatch(new LoadingMsg());
            Instance.StartCoroutine(Instance.ExecLoadScene(() => State.StateManager.instance.Dispatch(new LoadedSceneMsg(scene))));
        });
    }

    private static LoadSceneCmd _instance;
    private static LoadSceneCmd Instance
    {
        get
        {
            if (_instance) return _instance;
            var go = new GameObject("LoadSceneCmdActor");
            _instance = go.AddComponent<LoadSceneCmd>();
            DontDestroyOnLoad(go);

            return _instance;
        }
    }

    private static Queue<AsyncOperation> _sceneQueue = new Queue<AsyncOperation>();

    IEnumerator ExecLoadScene(System.Action callback)
    {
        var async = _sceneQueue.Dequeue();
        yield return new WaitWhile(() => async.progress < 0.9f);
        async.allowSceneActivation = true;
        yield return new WaitForSeconds(0.5f);
        callback();
    }
}
