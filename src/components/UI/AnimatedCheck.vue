<template>
  <div class="check-container">
    <svg height="100" width="100">
      <circle cx="50" cy="50" r="40" />
    </svg>
    <div class="icon-container">
      <fa-icon class="icon" icon="check" />
    </div>
    <div class="border-container"></div>
  </div>
</template>

<style scoped>
.check-container {
  position: relative;
}

circle {
  fill: transparent;
  stroke: lightgreen;
  stroke-width: 5;
  stroke-dasharray: 250;
  stroke-dashoffset: 1000;
  animation: rotate 1s ease;
}

@keyframes rotate {
  from {
    stroke-dashoffset: 250;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.icon-container,
.border-container {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
}
.icon-container {
  width: 100%;
  height: 100%;
  color: lightgreen;
  z-index: 1;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.border-container {
  width: 100%;
  height: 100%;
  border: 1px solid lightgreen;
  transform: scale(0.8);
  animation: expand 0.3s ease;
  animation-delay: 1s;
  opacity: 0;
}

@keyframes expand {
  from {
    transform: scale(0.8);
    opacity: 1;
  }
  to {
    transform: scale(1.5);
    opacity: 0;
  }
}

.icon {
  animation: icon-expand 1.5s ease;
}

@keyframes icon-expand {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
