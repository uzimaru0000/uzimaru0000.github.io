using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Egg : MonoBehaviour
{
    private Animator _animator;
    private Camera _camera;
    private static readonly int Shake = Animator.StringToHash("shake");
    private static readonly int Bound = Animator.StringToHash("bound");

    void Start()
    {
        _camera = Camera.main;
        _animator = GetComponent<Animator>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = _camera.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit) && hit.collider.gameObject == gameObject)
            {
                AnimationTrigger();
            }
        }
    }

    void AnimationTrigger()
    {
        var r = Random.value;
        if (r > 0.5f)
        {
            _animator.SetTrigger(Shake);
        }
        else
        {
            _animator.SetTrigger(Bound);
        }
    }
}
