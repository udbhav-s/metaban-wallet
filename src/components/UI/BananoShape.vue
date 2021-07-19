<template>
  <div :class="[loader ? 'loading' : '']" class="shape-container">
    <div
      class="shape"
      :style="
        !loader
          ? `transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translate3dX}px, ${translate3dY}px, 0px)`
          : ''
      "
    >
      <div class="outer-circle-1 circle">
        <svg
          class="banano-shape"
          enable-background="new 0 0 2217.4 1176.5"
          viewBox="0 0 2217.4 1176.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m1597.5 1167.9c-695.8 87.8-1016.2-526.5-959.4-586.4 37.5-39.6 95.9-41.9 146.4-43.3 232.6-6.3 562 266 628.7 264.7 129.4-2.7 323.9-208.8 451.4-378.7 53.4-71.1 386.8-178.2 349.8 8.6-119.8 605.6-528.2 723.9-616.9 735.1zm-977.6-1159.3c695.8-87.9 1016.2 526.4 959.3 586.4-37.5 39.6-95.8 41.9-146.4 43.3-232.6 6.3-561.9-266.1-628.7-264.7-129.3 2.7-323.9 208.8-451.5 378.7-53.3 71.1-386.7 178.2-349.8-8.5 119.9-605.7 528.4-724 617.1-735.2z"
          />
        </svg>
      </div>
      <div class="outer-circle-2 circle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "BananoShape",
  props: {
    mouseControlled: {
      type: Boolean,
      required: false,
    },
    loader: {
      type: Boolean,
      required: false,
    },
  },

  setup(props) {
    const rotateX = ref(10); // on X axis
    const rotateY = ref(10); // on Y axis
    const translate3dX = ref(0);
    const translate3dY = ref(0);

    if (props.mouseControlled) {
      onMounted(() => {
        window.addEventListener("mousemove", (e) => {
          rotateY.value = (e.x / window.innerWidth - 0.5) * 40;
          rotateX.value = -1 * (e.y / window.innerHeight - 0.5) * 40;
          translate3dX.value = (e.x / window.innerWidth - 0.5) * 30;
          translate3dY.value = (e.y / window.innerHeight - 0.5) * 40;
        });
      });
    }

    return {
      rotateX,
      rotateY,
      translate3dX,
      translate3dY,
    };
  },
});
</script>

<style scoped>
/* font-size is used to control size of shape with em  */

.shape-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 20em;
  position: relative;
  perspective: 800px;
}

.shape {
  transform-style: preserve-3d;
}
.loading .shape {
  animation: shape-loading 1s ease infinite;
}

.circle {
  transform-style: preserve-3d;
  border-radius: 50%;
  border: 2px solid var(--yellow-primary);
}

.outer-circle-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20em;
  height: 20em;
}

.outer-circle-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateZ(-5em);
}

.banano-shape {
  fill: transparent;
  stroke: var(--yellow-primary);
  stroke-width: 20;
  max-width: 13em;
}
</style>
