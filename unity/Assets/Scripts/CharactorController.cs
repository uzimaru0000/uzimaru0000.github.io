using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class CharactorController : MonoBehaviour
{
    private Rigidbody _rigidbody;
    private bool isJump;
    [SerializeField] private float power;
    [SerializeField] private float jumpPower;
    [SerializeField] private CameraController _cameraController;

    Rigidbody rigidbody
    {
        get
        {
            if (!_rigidbody)
            {
                _rigidbody = GetComponent<Rigidbody>();
            }

            return _rigidbody;
        }
    }

    public void Reset()
    {
        rigidbody.velocity = Vector3.zero;
        rigidbody.angularVelocity = Vector3.zero;
        transform.rotation = Quaternion.identity;
    }

    void Update()
    {
        if (!isJump && Input.GetKeyDown(KeyCode.Space))
        {
            Jump();
        }

        var v = Input.GetAxis("Vertical");
        var h = Input.GetAxis("Horizontal");
        var force = (_cameraController.ViewDirection(Vector3.forward) * v + _cameraController.ViewDirection(Vector3.right) * h) * power;
        rigidbody.AddForce(force);
    }

    void Jump()
    {
        var velocity = Vector3.up * jumpPower;
        rigidbody.AddForce(velocity, ForceMode.VelocityChange);
        isJump = true;
    }

    void OnCollisionEnter(Collision other)
    {
        isJump = false;
    }
}
