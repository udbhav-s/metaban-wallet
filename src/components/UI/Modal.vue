<template>
  <div class="modal-container">
    <div class="modal">
      <slot></slot>
    </div>
  </div>
  <div @click="close" class="modal-close">
    <fa-icon icon="times-circle" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  emits: ["close"],
  setup(props, { emit }) {
    const close = () => {
      emit("close");
    };

    return { close };
  },
});
</script>

<style>
.modal-container {
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  animation: blur 0.3s ease;
  backdrop-filter: blur(10px) opacity(1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  animation: fade-up 0.4s ease;
}

.modal-close {
  position: fixed;
  top: 0;
  right: 0;
  font-size: 3rem;
  color: white;
  z-index: 4;
  padding: 1rem;
  cursor: pointer;
}

.modal-close:hover {
  color: rgba(255, 255, 255, 0.8);
}

@keyframes blur {
  0% {
    backdrop-filter: blur(10px) opacity(0);
  }
  100% {
    backdrop-filter: blur(10px) opacity(1);
  }
}
</style>
