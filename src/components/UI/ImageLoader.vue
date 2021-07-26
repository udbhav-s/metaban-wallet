<template>
  <img v-show="loaded" @load="loaded = true" :src="src" />
  <div v-if="!loaded" class="image-placeholder">
    <img
      src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"></svg>'
    />
    <div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ImageLoader",
  props: {
    src: {
      type: String,
      required: true,
    },
  },

  setup() {
    const loaded = ref(false);
    return { loaded };
  },
});
</script>

<style>
.image-placeholder {
  position: relative;
}

.image-placeholder > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(255, 255, 255, 0.05),
    rgba(150, 150, 150, 0.05)
  );
  animation: gradient 1s ease infinite;
  background-size: 400% 400%;
  border-radius: 10%;
}

@keyframes gradient {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
</style>
