using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices.WindowsRuntime;
using State;
using UniTEA;
using UnityEngine;

public class Coin : MonoBehaviour, IEffect<(Coin, Collider)>
{
    public event Action<(Coin, Collider)> OnOccurrence;
    
    public Sub<(Coin, Collider)> ToSub() => new Sub<(Coin, Collider)>(this);

    void OnTriggerEnter(Collider other)
    {
        OnOccurrence?.Invoke((this, other));
    }
}
