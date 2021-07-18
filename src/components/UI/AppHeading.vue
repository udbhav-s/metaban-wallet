<template>
  <div class="app-heading">
    <span class="meta-text-container">
      <span class="meta-text">Meta</span>
    </span>
    <span class="remaining-text">
      <span class="yellow-gradient-text">Ban</span> Wallet
    </span>
  </div>
</template>

<style>
@keyframes slide-left {
  0% {
    margin-right: -4ch;
  }
  100% {
    margin-right: 0;
  }
}

.app-heading {
  color: white;
  font-weight: bold;
  font-style: Rubik, sans-serif;
}

.meta-text-container {
  z-index: 0;
}

.animated .meta-text {
  animation: slide-left 1s ease;
}

.remaining-text {
  z-index: 1;
  background: var(--bg-black-primary);
}
</style>
