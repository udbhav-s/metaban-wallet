<template>
  <div>
    <div class="hero-section">
      <div>
        <transition name="slide-fade" mode="out-in">
          <div v-if="route === 'Home'" class="home">
            <banano-shape class="logo" />
            <app-heading class="animated heading" />
            <p>
              Own and manage NFTs on the
              <span class="primary-yellow-text">Banano</span> chain
            </p>
            <div class="buttons">
              <button class="empty-button" @click="importSeed">
                <fa-icon class="icon" icon="download" />Import Seed
              </button>
              <button class="empty-button" @click="newSeed">
                <fa-icon class="icon" icon="plus" />New Seed
              </button>
            </div>
          </div>
          <div v-else-if="route === 'NewSeed'" class="new-seed-view">
            <new-seed />
          </div>
          <div v-else-if="route === 'ImportSeed'" class="import-seed-view">
            <new-seed :importSeed="true" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import AppHeading from "@/components/UI/AppHeading.vue";
import BananoShape from "@/components/UI/BananoShape.vue";
import NewSeed from "@/components/NewSeed.vue";

export default defineComponent({
  name: "Home",
  components: {
    AppHeading,
    BananoShape,
    NewSeed,
  },

  setup() {
    const router = useRouter();
    const route = computed(() => router.currentRoute.value.name);

    const newSeed = () => router.push({ name: "NewSeed" });
    const importSeed = () => router.push({ name: "ImportSeed" });

    return {
      route,
      newSeed,
      importSeed,
    };
  },
});
</script>

<style>
.hero-section {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
  font-size: 1.2rem;
}

.home .heading {
  font-size: 3rem;
  margin-top: 5rem;
}

.home p span {
  display: inline-block;
}

.home .buttons {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
}

.home .buttons button {
  color: var(--yellow-primary);
  animation: fade-up 0.5s ease;
}
.home .buttons button:nth-child(2) {
  animation-duration: 1s;
}

.home .buttons .icon {
  margin-right: 5px;
}
</style>
