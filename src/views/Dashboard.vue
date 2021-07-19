<template>
  <div>
    <div v-if="loadingAccounts" class="banano-loader-container">
      <banano-shape :loader="true" class="banano-loader" />
    </div>
    <div v-else>
      <div class="heading">Nothing here yet!</div>
      <div v-for="account in accounts" :key="account.address">
        <img
          :src="`https://monkey.banano.cc/api/v1/monkey/${account.address}`"
          alt=""
        />
        {{ account.address }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeUtil, store } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import BananoShape from "@/components/UI/BananoShape.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    BananoShape,
  },

  setup() {
    const router = useRouter();
    if (!storeUtil.getters.seed()) router.push("/");

    const accounts = computed(() => store.accounts);
    const loadingAccounts = ref(false);
    if (accounts.value.length === 0) {
      loadingAccounts.value = true;
      storeUtil.mutations
        .loadAccounts()
        .then(() => (loadingAccounts.value = false));
    }

    return {
      accounts,
      loadingAccounts,
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

.banano-loader {
  font-size: 5px;
}
</style>
