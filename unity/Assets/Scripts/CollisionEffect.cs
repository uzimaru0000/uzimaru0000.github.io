using System;
using UnityEngine;
using UniTEA;

public class CollisionEffect : MonoBehaviour, IEffect<Collision>
{
    public event Action<Collision> OnOccurrence;

    public Sub<Collision> ToSub() => new Sub<Collision>(this);
    
    private void OnCollisionEnter(Collision other)
    {
        OnOccurrence?.Invoke(other);
    }
}
