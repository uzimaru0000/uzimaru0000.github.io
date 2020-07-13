<template>
  <div
    :class="{ panel: true, clickable: isClickable }"
    @click="() => isClickable && $emit('click', coord)"
  >
    <transition name="stone">
      <div v-if="panel === 'BLACK'" class="stone black" key="black"></div>
      <div v-else-if="panel === 'WHITE'" class="stone white" key="white"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { Panel } from "./logic";

type Props = {
  panel: Panel;
  idx: number;
  isClickable: boolean;
};

export default defineComponent({
  props: {
    panel: {
      type: String
    },
    idx: {
      type: Number
    },
    isClickable: {
      type: Boolean
    }
  },
  setup({ idx }: Props) {
    const coord = computed(() => [idx % 8, Math.floor(idx / 8)]);

    return {
      coord
    };
  }
});
</script>
