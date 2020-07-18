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
import { defineComponent, reactive, computed } from '@vue/composition-api';
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

const cpuMove = (field: Field) => async (puttableArea: number[]) => {
  const calcProcess = Promise.resolve()
    .then(() => cpuLogic(puttableArea))
    .then((p) => [p % 8, Math.floor(p / 8)] as [number, number]);

  await new Promise((res) => setTimeout(() => res(), 1000));

  const [x, y] = await calcProcess;
  return putPanel(field)(WHITE, x, y);
};

const checkResult = (field: Field) => {
  const result = aggregate(field);

  if (result[NONE] !== 0) {
    return NONE;
  }

  if (result[BLACK] > result[WHITE]) {
    return BLACK;
  } else if (result[BLACK] < result[WHITE]) {
    return WHITE;
  } else {
    return 'DRAW';
  }
};

export default defineComponent({
  components: { Panel, Result },
  setup() {
    const state = reactive<State>({
      field: init(),
      turn: BLACK,
      isFinish: NONE,
    });

    const puttableArea = computed(() =>
      state.field
        .map<[boolean, number]>((_, idx) => {
          const [x, y] = [idx % 8, Math.floor(idx / 8)];
          return [isPutable(state.field)(state.turn, x, y), idx];
        })
        .filter(([f, _]) => f)
        .map(([_, idx]) => idx)
    );

    const isClickable = function(idx: number) {
      const [x, y] = [idx % 8, Math.floor(idx / 8)];
      return isPutable(state.field)(state.turn, x, y);
    };

    const putStone = async function([x, y]: [number, number]) {
      state.field = putPanel(state.field)(state.turn, x, y);
      state.turn = state.turn === BLACK ? WHITE : BLACK;

      // 置く場所が無かったら次のターン
      if (puttableArea.value.length === 0) {
        state.turn = state.turn === BLACK ? WHITE : BLACK;
      }

      // 敵の行動
      if (state.turn === WHITE) {
        state.field = await cpuMove(state.field)(puttableArea.value);
        state.turn = BLACK;
      }

      // 終わったら
      state.isFinish = checkResult(state.field);
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
