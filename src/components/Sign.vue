<template>
  <div class="sign">
    <transition name="slide-fade" mode="out-in">
      <div class="success" v-if="transactionSuccessful">
        <animated-check />
        Success!
      </div>
      <div v-else>
        <div class="secondary-text">
          <template v-if="remoteUrl">
            <span class="primary-yellow-text">{{ remoteUrl }}</span> requested
          </template>
        </div>
        <div class="heading">
          <template v-if="signData.type === 'hash'">Sign Hash</template>
          <template v-else>Sign Transaction</template>
        </div>
        <div class="sign-contents">
          {{ signData.type === "hash" ? signData.hash : signData.transaction }}
        </div>
        <div v-if="!hideAccountSelection">
          <select>
            <option
              v-for="(account, i) in accounts"
              :value="i"
              :key="account.address"
            >
              {{ account.address }}
            </option>
          </select>
        </div>
        <div v-else class="with-address-container">
          with
          <span class="with-address secondary-text">{{
            selectedAccount.address
          }}</span>
        </div>
        <div>
          <app-button @click="sign" :loading="transactionInProgress" outlined>
            Sign
          </app-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, PropType } from "vue";
import { SignData } from "@/types";
import { bananoUtil } from "@/util/banano";
import { storeUtil } from "@/store";
import AnimatedCheck from "@/components/UI/AnimatedCheck.vue";

export default defineComponent({
  name: "Sign",
  components: {
    AnimatedCheck,
  },
  props: {
    signData: {
      type: Object as PropType<SignData>,
      required: true,
    },
    remoteUrl: {
      type: String,
      required: false,
    },
    index: {
      type: Number,
      required: false,
    },
    hideAccountSelection: {
      type: Boolean,
      required: false,
    },
  },

  setup(props, { emit }) {
    const accounts = computed(storeUtil.getters.accounts);

    const selectedIndex = computed(() => {
      return props.index === undefined
        ? storeUtil.getters.lastUsedIndex()
        : props.index;
    });
    const selectedAccount = computed(() => accounts.value[selectedIndex.value]);

    const transactionSuccessful = ref(false);
    const transactionInProgress = ref(false);
    const sign = async () => {
      const index = selectedIndex.value;

      try {
        if (props.signData.type === "hash" && props.signData.hash) {
          const result = bananoUtil.signHash(
            props.signData.hash,
            storeUtil.getters.seed(),
            index
          );

          transactionSuccessful.value = true;
          emit("result", result);
        } else if (
          props.signData.type === "transaction" &&
          props.signData.transaction
        ) {
          transactionInProgress.value = true;

          const result = await bananoUtil.sendTransaction(
            props.signData.transaction,
            storeUtil.getters.seed(),
            index
          );

          transactionInProgress.value = false;
          transactionSuccessful.value = true;
          emit("result", result);
        }
      } catch (e) {
        emit("error", e);
        throw e;
      }

      storeUtil.mutations.setLastUsedIndex(index);
    };

    return {
      selectedIndex,
      selectedAccount,
      accounts,
      sign,
      transactionInProgress,
      transactionSuccessful,
    };
  },
});
</script>

<style>
.sign {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 1.2rem;
  padding-bottom: 2rem;
}

.heading {
  font-size: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.sign-contents {
  font-family: monospace;
  margin: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  word-wrap: break-word;
}

.sign select {
  margin: 0.5rem;
}

.sign select,
.sign select option {
  max-width: 20ch;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.sign .with-address {
  font-family: monospace;
  word-wrap: break-word;
  font-size: 1rem;
}

.sign .with-address-container {
  margin-bottom: 1rem;
}

.sign .success {
  padding: 1rem;
}
</style>
