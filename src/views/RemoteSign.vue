<template>
  <div class="remote-sign">
    <div class="heading-container">
      <app-heading />
    </div>
    <div class="content">
      <transition name="slide-fade" mode="out-in">
        <div v-if="signData && accounts[0]">
          <sign
            @result="onResult"
            :signData="signData"
            :index="index"
            :remoteUrl="remoteUrl"
          />
        </div>
        <div v-else class="loading-container">
          <div class="heading">Waiting for transaction...</div>
          <banano-shape loader class="loader" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import BananoShape from "@/components/UI/BananoShape.vue";
import AppHeading from "@/components/UI/AppHeading.vue";
import Sign from "@/components/Sign.vue";
import { storeUtil } from "@/store";
import { SignData } from "@/types";

export default defineComponent({
  name: "RemoteSign",
  components: {
    BananoShape,
    AppHeading,
    Sign,
  },

  setup() {
    const accounts = computed(storeUtil.getters.accounts);
    const remoteUrl = ref("");
    const signData = ref<SignData>();
    const index = computed(() =>
      accounts.value.findIndex((acc) => acc.address === signData.value?.address)
    );

    // post ready message
    if (window.opener) window.opener.postMessage("ready", "*");
    window.addEventListener("message", (e) => {
      if (e.data?.metabanSignData) {
        remoteUrl.value = e.origin;
        signData.value = e.data.metabanSignData;
      }
    });

    const onResult = (result: string) => {
      console.log("on result");
      if (window.opener) {
        window.opener.postMessage({ result }, "*");
      }
    };

    return {
      accounts,
      signData,
      remoteUrl,
      index,
      onResult,
    };
  },
});
</script>

<style>
.remote-sign {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.heading-container {
  text-align: center;
  font-size: 1.5rem;
  padding-top: 1rem;
}

.content {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}

.content .loading-container .heading {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.content .loading-container .loader {
  font-size: 7px;
}
</style>
