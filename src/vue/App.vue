<template>
  <div class="field">
    <panel
      v-for="(panel, i) in state.field"
      :key="i"
      :panel="panel"
      :idx="i"
      :isClickable="isClickable(i)"
      @click="putStone"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { init, isPutable, putPanel, Field } from "./logic";
import Panel from "./Panel.vue";

type State = {
  field: Field;
  turn: "BLACK" | "WHITE";
};

export default defineComponent({
  components: { Panel },
  setup() {
    const state = reactive<State>({
      field: init(),
      turn: "BLACK"
    });

    const isClickable = function(idx: number) {
      const [x, y] = [idx % 8, Math.floor(idx / 8)];
      return isPutable(state.field)(state.turn, x, y);
    };
    const putStone = function([x, y]: [number, number]) {
      state.field = putPanel(state.field)(state.turn, x, y);
      state.turn = state.turn === "BLACK" ? "WHITE" : "BLACK";
    };

    return {
      state,
      isClickable,
      putStone
    };
  }
});
</script>
