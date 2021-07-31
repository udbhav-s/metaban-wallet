<template>
  <div v-if="account" class="account-view">
    <modal v-if="sendNftAsset" @close="closeModal">
      <send-nft
        :assetHash="sendNftAsset"
        :index="accountIndex"
        class="send-nft"
      />
    </modal>

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
        Receive an incoming transaction to open this account
      </p>
    </div>

    <div class="nfts">
      <div class="nfts-header">
        <div class="heading">NFTs</div>
        <app-button @click="loadNfts" empty>
          <fa-icon icon="sync" class="secondary-text" />
        </app-button>
      </div>

      <div v-if="loadingNfts" class="loading-nfts">
        <banano-shape loader class="loader" />
      </div>

      <div v-else class="nft-list">
        <div v-for="nft in nfts" :key="nft.asset" class="nft secondary-text">
          <div class="nft-toolbar">
            <div>#{{ parseInt(nft.mint_number) + 1 }}</div>
            <template v-if="accountIndex !== -1">
              <div v-if="nft.received === 'true'">
                <tooltip text="Transfer">
                  <app-button @click="sendNftAsset = nft.asset" empty>
                    <fa-icon icon="exchange-alt" />
                  </app-button>
                </tooltip>
              </div>
              <div v-else>
                <tooltip text="Receive">
                  <app-button
                    @click="receiveNftAsset(nft)"
                    :loading="nft.receiving"
                    empty
                  >
                    <fa-icon icon="arrow-down" />
                  </app-button>
                </tooltip>
              </div>
            </template>
          </div>
          <image-loader
            :src="getImageUrl(nft.templateData.art_data_ipfs_cid)"
          />
          <div class="nft-title">
            {{ nft.templateData.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { storeUtil } from "@/store";
import { metanodeUtil } from "@/util/metanode";
import CopyButton from "@/components/UI/CopyButton.vue";
import ImageLoader from "@/components/UI/ImageLoader.vue";
import Modal from "@/components/UI/Modal.vue";
import SendNft from "@/components/SendNft.vue";
import BananoShape from "@/components/UI/BananoShape.vue";
import { Asset, BanAccount } from "@/types";
import { bananoUtil } from "@/util/banano";

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
    Modal,
    SendNft,
    BananoShape,
  },

  setup(props) {
    const seed = computed(storeUtil.getters.seed);
    const accounts = computed(storeUtil.getters.accounts);
    const accountIndex = computed(() =>
      accounts.value.findIndex((acc) => acc.address === props.address)
    );
    const account = ref<BanAccount>();

    const loadAccount = async () => {
      console.log(`Loading ${props.address}`);

      if (accountIndex.value !== -1)
        account.value = accounts.value[accountIndex.value];
      else {
        account.value = await bananoUtil.getAccount(props.address);
      }
    };
    loadAccount();
    watch([accountIndex, () => props.address], loadAccount);

    const nfts = ref<Asset[]>();
    const loadingNfts = ref(true);

    const loadNfts = async () => {
      console.log(`Loading ${props.address} assets`);

      nfts.value = [];
      loadingNfts.value = true;
      let res = await metanodeUtil.getAssetsOwnedByAccount(props.address);
      loadingNfts.value = false;
      nfts.value = res;
    };
    loadNfts();
    watch(() => props.address, loadNfts);

    const getImageUrl = (cid: string) =>
      new URL(cid, metanodeUtil.ipfsUrl).toString();

    const sendNftAsset = ref<string>();
    const closeModal = () => {
      sendNftAsset.value = undefined;
    };

    const receiveNftAsset = async (nft: Asset) => {
      nft.receiving = true;
      if (!nft.history) return;

      nft.history[nft.history.length - 1].receive = (
        await bananoUtil.receiveBlock(
          seed.value,
          accountIndex.value,
          nft.history[nft.history.length - 1].send,
          account.value?.representative
        )
      ).receiveBlocks[0];

      nft.received = "true";
      nft.receiving = false;
    };

    return {
      account,
      accountIndex,
      nfts,
      loadingNfts,
      sendNftAsset,
      getImageUrl,
      closeModal,
      receiveNftAsset,
      loadNfts,
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

.account-view .heading {
  font-size: 2rem;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.nfts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nfts-header button {
  font-size: 1.1rem;
}

.nfts {
  margin-top: 3rem;
}

@media (min-width: 1024px) {
  .nft-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .nft-list .nft {
    max-width: 200px;
    margin-left: 0;
    margin-right: 0;
  }

  .account-view .send-nft {
    max-width: 30rem;
  }
}

.nft {
  background-color: rgba(255, 255, 255, 0.05);
  padding-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
  padding-bottom: 0.8rem;
}

.nft .nft-toolbar {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nft-toolbar button {
  color: inherit;
}

.nft img {
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.nft > *:not(:last-child) {
  margin-bottom: 0.8rem;
}

.nft .nft-title {
  font-weight: bold;
  text-align: center;
  font-size: 1.1rem;
}

.send-nft {
  background: var(--bg-black-primary);
  margin: auto;
  max-width: 20rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.loading-nfts .loader {
  font-size: 3px;
}
</style>
