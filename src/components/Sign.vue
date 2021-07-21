<template>
  <div class="sign">
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
    <div>
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
    <div>
      <button @click="sign" class="outlined-button">Sign</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { SignData } from "@/types";
import { bananoUtil } from "@/util/banano";
import { storeUtil } from "@/store";

export default defineComponent({
  name: "Sign",
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
  },

  setup(props, { emit }) {
    const accounts = computed(storeUtil.getters.accounts);

    const selectedIndex = ref(storeUtil.getters.lastUsedIndex());
    watch(props, (newProps) => {
      if (newProps.index && newProps.index >= 0)
        selectedIndex.value = newProps.index;
    });
    const selectedAccount = computed(() => accounts.value[selectedIndex.value]);

    const sign = () => {
      const index = selectedIndex.value;

      try {
        if (props.signData.type === "hash" && props.signData.hash) {
          const result = bananoUtil.signHash(
            props.signData.hash,
            storeUtil.getters.seed(),
            index
          );

          emit("result", result);
        } else if (
          props.signData.type === "transaction" &&
          props.signData.transaction
        ) {
          const result = bananoUtil.sendTransaction(
            props.signData.transaction,
            storeUtil.getters.seed(),
            index
          );

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
</style>
