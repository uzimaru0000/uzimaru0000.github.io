using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Camera))]
public class CameraController : MonoBehaviour
{
    [SerializeField] private float distance;
    [SerializeField] private Transform target;
    [SerializeField] private float height;

    private Camera _camera;

    private void Start()
    {
        _camera = GetComponent<Camera>();
    }

    private void Update()
    {
        var pos = transform.position;
        pos.y = height;
        var dir = (pos - target.position).normalized;
        transform.position = target.position + dir * distance;
        transform.LookAt(target);
    }

    public Vector3 ViewDirection(Vector3 worldDir)
    {
        var dir = _camera.transform.TransformDirection(worldDir);
        dir.y = 0;
        return dir.normalized;
    }

    public void Reset()
    {
        transform.rotation = Quaternion.identity;
        transform.position = -target.forward * distance;
    }
}
