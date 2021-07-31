<template>
  <div>
    <transition name="slide-fade" mode="out-in">
      <div v-if="!addressPicked" class="address-form">
        <div>Enter Banano address to send to</div>
        <div>
          <input
            v-model="banAddress"
            required
            type="text"
            placeholder="Address"
          />
          <button @click="validateAddress" class="outlined-button">
            Continue
          </button>
        </div>
        <div v-if="invalidAddress" class="warning-text">Invalid Address</div>
      </div>
      <div v-else>
        <sign
          :signData="signData"
          :index="index"
          :hideAccountSelection="true"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Sign from "@/components/Sign.vue";
import { SignData } from "@/types";
import { bananoUtil } from "@/util/banano";

export default defineComponent({
  name: "SendNft",
  components: {
    Sign,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    assetHash: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const banAddress = ref("");
    const addressPicked = ref(false);
    const invalidAddress = ref(false);
    const validateAddress = () => {
      if (!banAddress.value || !bananoUtil.isAccountValid(banAddress.value)) {
        invalidAddress.value = true;
      } else addressPicked.value = true;
    };

    const signData = computed<SignData>(() => ({
      type: "transaction",
      transaction: {
        amount: "1",
        destination: banAddress.value,
        representative: bananoUtil.getAddressFromBlockHash(props.assetHash),
      },
    }));

    return {
      banAddress,
      addressPicked,
      signData,
      invalidAddress,
      validateAddress,
    };
  },
});
</script>

<style>
.address-form {
  padding: 2rem;
  border-radius: 10px;
}

.address-form > * {
  margin-bottom: 1rem;
}

.address-form input[type="text"] {
  margin-right: 0.5rem;
}

.address-form .warning-text {
  margin-top: 0.5rem;
}
</style>
