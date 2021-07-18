<template>
  <div>
    <div class="hero-section">
      <div>
        <banano-shape class="logo" />
        <app-heading class="animated heading" />
        <p>
          Own and manage NFTs on the
          <span class="primary-yellow-text">Banano</span> chain
        </p>
        <div class="buttons">
          <button class="empty-button">
            <fa-icon class="icon" icon="download" />Import Seed
          </button>
          <button class="empty-button">
            <fa-icon class="icon" icon="plus" />New Seed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeading from "@/components/UI/AppHeading.vue";
import BananoShape from "@/components/UI/BananoShape.vue";

export default defineComponent({
  name: "Home",
  components: {
    AppHeading,
    BananoShape,
  },
});
</script>

<style>
.hero-section {
  height: 50vh;
  text-align: center;
  padding: 2rem;
  color: white;
  font-size: 1.2rem;
}

.hero-section .heading {
  font-size: 3rem;
  margin-top: 5rem;
}

.hero-section .logo {
  margin-top: 5rem;
}

.hero-section p span {
  display: inline-block;
}

.hero-section .buttons {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
}

.hero-section .buttons button {
  color: var(--yellow-primary);
  animation: fade-up 0.5s ease;
}
.hero-section .buttons button:nth-child(2) {
  animation-duration: 1s;
}

.hero-section .buttons .icon {
  margin-right: 5px;
}
</style>
