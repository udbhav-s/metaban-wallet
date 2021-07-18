import { reactive } from "vue";

export const store = reactive({
  seed: "",
});

export const storeUtil = {
  getters: {
    seed: (): string => store.seed,
  },

  mutations: {
    loadSeed(): void {
      store.seed = localStorage.getItem("seed");
    },

    setSeed(seed: string): void {
      store.seed = seed;
      localStorage.setItem("seed", seed);
    },
  },
};
