<template>
  <div>
    <div class="sidebar-trigger">
      <fa-icon class="trigger-icon" icon="bars" />
    </div>

    <div class="sidebar">
      <router-link to="/"><app-heading class="heading" /></router-link>
      <div class="sidebar-section">
        <div class="sidebar-heading">Accounts</div>
        <div v-if="!seed" class="login-button-container">
          <app-button @click="login" outlined class="login-button">
            Login
          </app-button>
        </div>
        <div v-else class="accounts-list">
          <div
            v-for="account in accounts"
            :key="account.address"
            @click="goToAccount(account.address)"
            :class="[address === account.address ? 'active' : '']"
            class="account"
          >
            <image-loader
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import AppHeading from "@/components/UI/AppHeading.vue";
import BananoShape from "@/components/UI/BananoShape.vue";
import ImageLoader from "@/components/UI/ImageLoader.vue";
import { storeUtil } from "@/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Sidebar",
  components: {
    AppHeading,
    BananoShape,
    ImageLoader,
  },

  setup() {
    const router = useRouter();

    const seed = computed(storeUtil.getters.seed);
    const accounts = computed(storeUtil.getters.accounts);
    const address = computed(() => {
      const route = router.currentRoute.value;
      if (route.name === "Account") return route.params.banAddress as string;
      else return null;
    });

    const loadingNewAccount = ref(false);
    const addAccount = async () => {
      loadingNewAccount.value = true;
      await storeUtil.mutations.addAccount();
      loadingNewAccount.value = false;
    };

    const goToAccount = (address: string) => {
      router.push({
        name: "Account",
        params: {
          banAddress: address,
        },
      });
    };

    const login = () => {
      router.push({
        name: "Home",
        query: {
          redirect: router.currentRoute.value.fullPath,
        },
      });
    };

    return {
      seed,
      accounts,
      address,
      loadingNewAccount,
      addAccount,
      goToAccount,
      login,
    };
  },
});
</script>

<style>
.sidebar {
  position: fixed;
  z-index: 3;
  top: 0;
  left: calc(-1 * var(--sidebar-width));
  height: 100%;
  width: var(--sidebar-width);
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 1.5rem;
  margin-top: var(--sidebar-trigger-height);
  background: var(--bg-black-primary);
}

.sidebar-trigger {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--sidebar-trigger-height);
  background: var(--bg-black-primary);
}

.sidebar-trigger .trigger-icon {
  margin: 1em 0 0 1em;
}

.sidebar:hover,
.sidebar:focus,
.sidebar-trigger:hover + .sidebar,
.sidebar-trigger:focus + .sidebar {
  left: 0;
}

@media (min-width: 1024px) {
  .sidebar {
    margin-top: 0;
  }

  .sidebar {
    left: 0;
  }

  .sidebar-trigger {
    display: none;
  }
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
  border-radius: 10px;
}

.sidebar .account:not(.active):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.sidebar .account.active {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.sidebar .account img {
  width: 2.5rem;
  height: 2.5rem;
}
.sidebar .account .image-placeholder {
  margin: 0.4rem;
}
.sidebar .account .image-placeholder img {
  margin: -0.4rem;
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

.sidebar .login-button-container {
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
