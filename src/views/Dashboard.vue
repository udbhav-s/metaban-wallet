<template>
  <div>
    <div v-if="seed && !accounts.length" class="banano-loader-container">
      <banano-shape :loader="true" class="banano-loader" />
    </div>
    <div v-else>
      <div id="dashboard">
        <sidebar />

        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeUtil } from "@/store";
import { computed, defineComponent, watch } from "vue";
import { useRouter } from "vue-router";
import BananoShape from "@/components/UI/BananoShape.vue";
import Sidebar from "@/components/Sidebar.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    BananoShape,
    Sidebar,
  },

  setup() {
    const router = useRouter();

    const seed = computed(storeUtil.getters.seed);
    const accounts = computed(storeUtil.getters.accounts);

    // on accounts load push to default route if none
    watch(accounts, (accs) => {
      if (accs.length && router.currentRoute.value.name === "Dashboard") {
        router.push({
          name: "Account",
          params: { banAddress: accs[0].address },
        });
      }
    });

    return {
      seed,
      accounts,
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
  /* sidebar */
  margin-top: 3em;
}

#dashboard .content {
  background: rgba(255, 255, 255, 0.05);
  min-height: 100vh;
  padding: 2rem;
}

/* Desktop */
@media (min-width: 1024px) {
  #dashboard {
    margin-top: 0;
  }

  #dashboard .content {
    margin-left: var(--sidebar-width);
  }
}
</style>
