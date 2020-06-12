using System;
using UniTEA;
using UnityEngine;

public class ColliderEffect : MonoBehaviour, IEffect<Collider>
{
    public event Action<Collider> OnOccurrence;
    
    public Sub<Collider> ToSub() => new Sub<Collider>(this);

    void OnTriggerEnter(Collider other)
    {
        OnOccurrence?.Invoke(other);
    }
}
