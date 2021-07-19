<template>
  <button @click="copy" class="empty-button">
    <fa-icon icon="copy" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CopyButton",
  props: {
    copyText: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const copy = () => navigator.clipboard.writeText(props.copyText);

    return {
      copy,
    };
  },
});
</script>
