<template>
  <div v-if="account">
    <div class="account-info">
      <image-loader
        :src="`https://monkey.banano.cc/api/v1/monkey/${account.address}`"
      />
      <div class="account-info-content">
        <div class="address">
          {{ account.address }}
          <copy-button :copyText="account.address" />
        </div>
        <div v-if="account.opened" class="balance">
          {{ account.balance }} BAN
        </div>
      </div>
    </div>

    <div v-if="!account.opened">
      <div class="heading">Unopened Account</div>
      <p class="secondary-text">
        Receive an incoming transaction using Kalium or BananoVault to open this
        account using the same seed
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { storeUtil } from "@/store";
import CopyButton from "@/components/UI/CopyButton.vue";
import ImageLoader from "@/components/UI/ImageLoader.vue";

export default defineComponent({
  name: "Account",
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  components: {
    CopyButton,
    ImageLoader,
  },

  setup(props) {
    const accounts = computed(storeUtil.getters.accounts);
    const account = computed(() =>
      accounts.value.find((acc) => acc.address === props.address)
    );

    return {
      account,
    };
  },
});
</script>

<style>
.account-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex-wrap: wrap;
  padding-top: 1rem;
}

.account-info img {
  max-width: 200px;
  margin: auto;
}

.account-info .account-info-content {
  max-width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
}

.account-info .image-placeholder {
  margin: 0.7rem;
  margin-left: auto;
  margin-right: auto;
}
.account-info .image-placeholder img {
  margin: -0.7rem;
}

/* Desktop */
@media (min-width: 1024px) {
  .account-info .account-info-content {
    max-width: 70%;
  }
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
</style>
