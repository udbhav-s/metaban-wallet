<template>
  <div>
    <div class="hero-section">
      <div>
        <transition name="slide-fade" mode="out-in">
          <div v-if="route === 'Home'" class="home">
            <banano-shape :mouseControlled="true" class="logo" />
            <app-heading class="animated heading" />
            <p>
              Own and manage NFTs on the
              <span class="primary-yellow-text">Banano</span> chain
            </p>
            <div v-if="seed">
              <router-link to="/dashboard">
                <button class="outlined-button">Go to wallet</button>
              </router-link>
            </div>
            <div v-else-if="hasSeed" class="password-field">
              <form @submit.prevent="submitPassword">
                <input
                  v-model="password"
                  type="password"
                  required
                  placeholder="Enter password"
                />
                <button type="submit" class="password-button empty-button">
                  <fa-icon icon="arrow-right" />
                </button>
              </form>
            </div>
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
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import AppHeading from "@/components/UI/AppHeading.vue";
import BananoShape from "@/components/UI/BananoShape.vue";
import NewSeed from "@/components/NewSeed.vue";
import { storeUtil } from "@/store";
import { bananoUtil } from "@/util/banano";

export default defineComponent({
  name: "Home",
  props: {
    redirect: {
      type: String,
      required: false,
    },
  },
  components: {
    AppHeading,
    BananoShape,
    NewSeed,
  },

  setup(props) {
    const router = useRouter();
    const route = computed(() => router.currentRoute.value.name);
    const seed = computed(storeUtil.getters.seed);

    const newSeed = () => router.push({ name: "NewSeed" });
    const importSeed = () => router.push({ name: "ImportSeed" });

    const hasSeed = ref(false);
    const encryptedSeed = storeUtil.getters.loadEncryptedSeed() as string;
    if (encryptedSeed) hasSeed.value = true;

    const password = ref("");
    const submitPassword = () => {
      const seed = bananoUtil.decryptSeed(encryptedSeed, password.value);
      if (!bananoUtil.isSeedValid(seed)) throw new Error("invalid password");

      storeUtil.mutations.loadSeed(password.value);
      storeUtil.mutations.loadAccounts();

      if (props.redirect) {
        router.push(props.redirect);
      } else router.push({ name: "Dashboard" });
    };

    return {
      route,
      seed,
      hasSeed,
      newSeed,
      importSeed,
      password,
      submitPassword,
    };
  },
});
</script>

<style>
.hero-section {
  text-align: center;
  margin-top: 7rem;
  font-size: 1.2rem;
}

.hero-section > div {
  padding-left: 1rem;
  padding-right: 1rem;
}

.home .logo {
  font-size: 10px;
}

.home .heading {
  font-size: 2.4rem;
  margin-top: 5rem;
}

.home p {
  color: var(--text-secondary);
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

.home .password-field {
  margin-top: 2rem;
}
.home .password-button {
  margin-left: 1rem;
}

.home .buttons button {
  animation: fade-up 0.5s ease;
}
.home .buttons button:nth-child(2) {
  animation-duration: 1s;
}

.home .buttons .icon {
  margin-right: 5px;
}
</style>
