<template>
  <button :class="{ 'outlined-button': outlined, 'empty-button': empty }">
    <spinner v-if="loading" />
    <slot v-else></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Spinner from "@/components/UI/Spinner.vue";

export default defineComponent({
  name: "Button",
  components: {
    Spinner,
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
    },
    empty: {
      type: Boolean,
      required: false,
    },
    outlined: {
      type: Boolean,
      required: false,
    },
  },
});
</script>

<style>
button {
  cursor: pointer;
  padding: 0.5rem;
}
button:disabled {
  cursor: not-allowed;
}

/* empty button */
button.empty-button {
  border: none;
  background: none;
  color: var(--yellow-primary);
}
button.empty-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}
button.empty-button:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

/* outlined button */
button.outlined-button {
  border: 1px solid var(--yellow-primary);
  background: none;
  color: var(--yellow-primary);
}
button.outlined-button:hover:not(:disabled) {
  color: var(--bg-black-primary);
  background-color: var(--yellow-primary);
}
</style>
