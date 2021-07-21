import { reactive } from "vue";
import { bananoUtil } from "@/util/banano";
import { BanAccount } from "@/types";

export const store = reactive({
  seed: "",
  lastUsedIndex: 0,
  accounts: [] as BanAccount[],
});

export const storeUtil = {
  getters: {
    seed: (): string => store.seed,
    accounts: (): BanAccount[] => store.accounts,
    lastUsedIndex: (): number => store.lastUsedIndex,

    loadEncryptedSeed(): string | null {
      return localStorage.getItem("encryptedSeed");
    },
  },

  mutations: {
    loadLastUsedIndex(): void {
      store.lastUsedIndex = parseInt(
        localStorage.getItem("lastUsedIndex") ?? "0"
      );
    },

    setLastUsedIndex(index: number): void {
      store.lastUsedIndex = index;
      localStorage.setItem("lastUsedIndex", index.toString());
    },

    loadSeed(password: string): void {
      const encryptedSeed = storeUtil.getters.loadEncryptedSeed();
      if (!encryptedSeed) throw new Error("No seed found in local storage");
      else {
        const seed = bananoUtil.decryptSeed(encryptedSeed, password);
        if (!bananoUtil.isSeedValid(seed)) {
          throw new Error("Invalid password");
        }
        store.seed = seed;
      }
    },

    setSeed(seed: string): void {
      store.seed = seed;
    },

    saveSeed(seed: string, password: string): void {
      this.setSeed(seed);
      const encryptedSeed = bananoUtil.encryptSeed(seed, password);
      localStorage.setItem("encryptedSeed", encryptedSeed);
    },

    async addAccount(): Promise<BanAccount> {
      const seed = storeUtil.getters.seed();
      const accounts = storeUtil.getters.accounts();
      const account = await bananoUtil.loadAccountAtIndex(
        seed,
        accounts.length
      );
      store.accounts.push(account);
      return account;
    },

    async loadAccounts(): Promise<void> {
      const seed = storeUtil.getters.seed();
      if (!seed) throw new Error("No seed, cannot load accounts");
      store.accounts = await bananoUtil.loadAccounts(seed);
    },
  },
};
