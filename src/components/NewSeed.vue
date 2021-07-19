<template>
  <div class="new-seed container">
    <transition name="slide-fade" mode="out-in">
      <div v-if="viewPage === 'seed'" key="seed">
        <div class="back-arrow-container">
          <button @click="goBack" class="empty-button">
            <fa-icon icon="arrow-left" />
          </button>
        </div>
        <div v-if="!importSeed">
          <div class="heading warning-text">
            <fa-icon icon="exclamation-triangle" /> DO NOT LOSE YOUR SEED!
          </div>
          <p>
            Store the seed in a safe location. If lost, you will not be able to
            recover your wallet.
          </p>
          <div class="seed">
            {{ seed }}
            <copy-button :copyText="seed" />
          </div>
          <div class="field">
            <input
              type="checkbox"
              v-model="seedDisclaimer"
              name="seed-stored"
            />
            Backed up
          </div>
        </div>
        <div v-else class="import-seed">
          <div class="heading">Import Seed</div>
          <div class="field">
            <input type="text" v-model="seed" placeholder="Enter seed" />
          </div>
        </div>
        <button
          @click="setSeed"
          :disabled="(!importSeed && !seedDisclaimer) || (importSeed && !seed)"
          class="continue-seed outlined-button"
        >
          Continue with seed
        </button>
      </div>
      <div v-else-if="viewPage === 'password'" key="password">
        <div class="back-arrow-container">
          <button @click="backToSeed" class="empty-button">
            <fa-icon icon="arrow-left" />
          </button>
        </div>
        <div class="heading">Set a Password</div>
        <div class="field">
          <input v-model="password" type="password" placeholder="Password" />
        </div>
        <div class="field">
          <input
            v-model="passwordCopy"
            type="password"
            placeholder="Repeat password"
          />
        </div>
        <div
          v-if="password && passwordCopy && password !== passwordCopy"
          class="field warning-text"
        >
          Passwords do not match
        </div>
        <div class="field">
          <button
            @click="setPassword"
            :disabled="!password || password !== passwordCopy"
            class="outlined-button"
          >
            Continue
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { bananoUtil } from "@/util/banano";
import { useRouter } from "vue-router";
import { storeUtil } from "@/store";
import CopyButton from "@/components/UI/CopyButton.vue";

export default defineComponent({
  name: "NewSeed",
  props: {
    importSeed: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    CopyButton,
  },

  setup(props) {
    const seed = ref("");
    if (!props.importSeed) seed.value = bananoUtil.generateRandomSeed();
    const seedDisclaimer = ref(false);

    const viewPage = ref("seed");
    const setSeed = () => (viewPage.value = "password");

    const router = useRouter();
    const goBack = () => router.push({ name: "Home" });
    const backToSeed = () => (viewPage.value = "seed");

    const password = ref("");
    const passwordCopy = ref("");
    const setPassword = () => {
      storeUtil.mutations.saveSeed(seed.value, password.value);
      router.push({ name: "Dashboard" });
    };

    return {
      seed,
      seedDisclaimer,
      viewPage,
      password,
      passwordCopy,
      goBack,
      backToSeed,
      setSeed,
      setPassword,
    };
  },
});
</script>

<style>
.new-seed {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  padding-bottom: 2rem;
}

.new-seed p {
  color: var(--text-secondary);
}

.new-seed .back-arrow-container {
  text-align: left;
  font-size: 1.3rem;
}

.new-seed .heading.warning-text {
  animation: shake 0.8s ease;
  animation-delay: 0.3s;
}

.new-seed .heading {
  font-size: 2rem;
}

.new-seed .seed {
  font-family: monospace;
  color: var(--yellow-primary);
  word-wrap: break-word;
}

.new-seed .seed button {
  color: inherit;
}

.new-seed .field {
  font-size: 1rem;
}
.new-seed .field input[type="checkbox"] {
  width: 1.1rem;
  height: 1.1rem;
  vertical-align: middle;
  position: relative;
  bottom: 1px;
}

.import-seed .heading {
  margin: 1rem;
}

.import-seed input {
  margin: 1rem;
}

.field,
.new-seed .continue-seed {
  margin-top: 1.5rem;
}
</style>
