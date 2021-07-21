<template>
  <div>
    <div v-if="!accounts" class="banano-loader-container">
      <banano-shape :loader="true" class="banano-loader" />
    </div>
    <div v-else>
      <div id="dashboard">
        <div class="sidebar">
          <router-link to="/"><app-heading class="heading" /></router-link>
          <div class="sidebar-section">
            <div class="sidebar-heading">Accounts</div>
            <div class="accounts-list">
              <div
                v-for="(account, i) in accounts"
                :key="account.address"
                @click="selectedAccountIndex = i"
                :class="[i === selectedAccountIndex ? 'active' : '']"
                class="account"
              >
                <img
                  :src="`https://monkey.banano.cc/api/v1/monkey/${account.address}`"
                />
                <div class="address">{{ account.address }}</div>
              </div>
              <div v-if="loadingNewAccount" class="new-account-loader">
                <banano-shape :loader="true" class="banano-loader" />
              </div>
              <div class="add-account-button">
                <button @click="addAccount" class="empty-button">
                  <fa-icon icon="plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div v-if="selectedAccount">
            <div class="account-info">
              <img
                :src="`https://monkey.banano.cc/api/v1/monkey/${selectedAccount.address}`"
              />
              <div class="account-info-content">
                <div class="address">
                  {{ selectedAccount.address }}
                  <copy-button :copyText="selectedAccount.address" />
                </div>
                <div v-if="selectedAccount.opened" class="balance">
                  {{ selectedAccount.balance }} BAN
                </div>
              </div>
            </div>
            <div v-if="!selectedAccount.opened">
              <div class="heading">Unopened Account</div>
              <p class="secondary-text">
                Receive an incoming transaction using Kalium or BananoVault to
                open this account using the same seed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeUtil } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import BananoShape from "@/components/UI/BananoShape.vue";
import AppHeading from "@/components/UI/AppHeading.vue";
import CopyButton from "@/components/UI/CopyButton.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    BananoShape,
    AppHeading,
    CopyButton,
  },

  setup() {
    const router = useRouter();
    if (!storeUtil.getters.seed()) router.push("/");

    const accounts = computed(storeUtil.getters.accounts);
    const selectedAccountIndex = ref(0);
    const selectedAccount = computed(() => {
      if (accounts.value && accounts.value[selectedAccountIndex.value])
        return accounts.value[selectedAccountIndex.value];
      else return undefined;
    });

    const loadingNewAccount = ref(false);
    const addAccount = async () => {
      loadingNewAccount.value = true;
      await storeUtil.mutations.addAccount();
      loadingNewAccount.value = false;
    };

    return {
      accounts,
      selectedAccountIndex,
      selectedAccount,
      loadingNewAccount,
      addAccount,
    };
  },
});
</script>

<style>
.banano-loader-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banano-loader-container .banano-loader {
  font-size: 5px;
}

#dashboard {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: stretch;
}

#dashboard .content {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  overflow-y: scroll;
  padding: 2rem;
}

#dashboard .content .account-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding-top: 1rem;
}

.account-info img,
.account-info object {
  max-width: 200px;
}

.account-info .account-info-content {
  min-width: 0;
}

.account-info .address {
  font-family: monospace;
  font-size: 1.5rem;
  color: var(--yellow-primary);
  overflow-wrap: break-word;
  margin-right: 1rem;
}

.account-info .balance {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-top: 1rem;
}

.content .heading {
  font-size: 2rem;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
}

#dashboard .sidebar {
  padding: 1.5rem;
  max-width: 30ch;
}

.sidebar .heading {
  font-size: 1.5rem;
}

.sidebar .sidebar-section {
  margin-top: 3rem;
}

.sidebar-section .sidebar-heading {
  font-size: 1.2rem;
  font-weight: lighter;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.sidebar .account {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  color: var(--text-secondary);
  padding: 5px;
  cursor: pointer;
}

.sidebar .account.active {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border-radius: 10px;
}

.sidebar .account img {
  width: 2.5rem;
  height: 2.5rem;
}

.sidebar .account .address {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 30ch;
}

.accounts-list .new-account-loader {
  padding: 1rem;
}

.accounts-list .new-account-loader .banano-loader {
  font-size: 2px;
}

.sidebar .add-account-button {
  margin-top: 0.5rem;
  text-align: center;
}
</style>
