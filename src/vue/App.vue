<template>
  <div class="field">
    <panel
      v-for="(panel, i) in state.field"
      :key="i"
      :panel="panel"
      :idx="i"
      :isClickable="isClickable(i)"
      @click="(p) => state.turn === 'BLACK' && putStone(p)"
    ></panel>
    <result
      v-if="state.isFinish !== 'NONE'"
      :result="state.isFinish"
      @click="replay"
    ></result>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import {
  init,
  isPutable,
  putPanel,
  Field,
  BLACK,
  WHITE,
  NONE,
  aggregate,
  cpuLogic,
} from './logic';
import Panel from './Panel.vue';
import Result from './Result.vue';

type State = {
  field: Field;
  turn: typeof BLACK | typeof WHITE;
  isFinish: typeof BLACK | typeof WHITE | 'DRAW' | typeof NONE;
};

export default defineComponent({
  components: { Panel, Result },
  setup() {
    const state = reactive<State>({
      field: init(),
      turn: BLACK,
      isFinish: NONE,
    });

    const isClickable = function(idx: number) {
      const [x, y] = [idx % 8, Math.floor(idx / 8)];
      return isPutable(state.field)(state.turn, x, y);
    };

    const putStone = function([x, y]: [number, number]) {
      state.field = putPanel(state.field)(state.turn, x, y);
      state.turn = state.turn === BLACK ? WHITE : BLACK;

      const puttableArea = state.field
        .map<[boolean, number]>((_, idx) => {
          const [x, y] = [idx % 8, Math.floor(idx / 8)];
          return [isPutable(state.field)(state.turn, x, y), idx];
        })
        .filter(([f, _]) => f)
        .map(([_, idx]) => idx);

      // 置く場所が無かったら次のターン
      if (puttableArea.length === 0) {
        state.turn = state.turn === BLACK ? WHITE : BLACK;
      }

      // 終わったら
      if (state.field.every((x) => x !== NONE)) {
        const result = aggregate(state.field);
        if (result.BLACK > result.WHITE) {
          state.isFinish = BLACK;
        } else if (result.BLACK < result.WHITE) {
          state.isFinish = WHITE;
        } else {
          state.isFinish = 'DRAW';
        }

        return;
      }

      if (state.turn === WHITE) {
        const calcProcess = Promise.resolve()
          .then(() => cpuLogic(puttableArea))
          .then((p) => [p % 8, Math.floor(p / 8)] as [number, number]);

        // 思考時間っぽくした
        setTimeout(async () => {
          const pos = await calcProcess;
          putStone(pos);
        }, 1000);
      }
    };

    const replay = function() {
      state.field = init();
      state.turn = BLACK;
      state.isFinish = NONE;
    };

    return {
      state,
      isClickable,
      putStone,
      replay,
    };
  },
});
</script>
