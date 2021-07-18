<template>
  <div class="new-seed container">
    <div class="back-arrow-container">
      <button @click="goBack" class="empty-button">
        <fa-icon icon="arrow-left" />
      </button>
    </div>
    <div v-if="!importSeed">
      <div class="heading warning">
        <fa-icon icon="exclamation-triangle" /> DO NOT LOSE YOUR SEED!
      </div>
      <p>
        Store the seed in a safe location. If lost, you will not be able to
        recover your wallet.
      </p>
      <div class="seed">
        {{ seed }}
        <button @click="copySeed" class="empty-button">
          <fa-icon icon="copy" />
        </button>
      </div>
      <div class="field">
        <input type="checkbox" v-model="seedDisclaimer" name="seed-stored" />
        Backed up
      </div>
    </div>
    <div v-else class="import-seed">
      <div class="heading">Import Seed</div>
      <input type="text" v-model="seed" placeholder="Enter seed" />
    </div>
    <button
      :disabled="(!importSeed && !seedDisclaimer) || (importSeed && !seed)"
      class="continue-seed outlined-button"
    >
      Continue with seed
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { bananoUtil } from "@/util/banano";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NewSeed",
  props: {
    importSeed: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const seed = ref("");
    if (!props.importSeed) seed.value = bananoUtil.generateRandomSeed();
    const seedDisclaimer = ref(false);
    const copySeed = () => navigator.clipboard.writeText(seed.value);

    const router = useRouter();
    const goBack = () => router.push({ name: "Home" });

    return {
      seed,
      seedDisclaimer,
      goBack,
      copySeed,
    };
  },
});
</script>

<style>
.new-seed {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
}

.new-seed .back-arrow-container {
  text-align: left;
  font-size: 1.3rem;
}
.new-seed .back-arrow-container button {
  color: var(--yellow-primary);
}

.new-seed .heading.warning {
  color: var(--red-primary);
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
  color: rgba(255, 255, 255, 0.8);
}
.new-seed .field input {
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
