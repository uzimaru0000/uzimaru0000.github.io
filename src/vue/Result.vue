<template functional>
  <div class="result">
    <div>{{ props.result === 'BLACK' ? "You are winner!!" : props.result === "WHITE" ? "You are loser" : "DRAW" }}</div>
    <button @click="listeners.click">Replay</button>
  </div>
</template>

