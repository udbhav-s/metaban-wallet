import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import * as bananojs from "@bananocoin/bananojs";
import { BanAccount } from "@/store";

function toHex(buffer: Uint8Array) {
  return Array.prototype.map
    .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export const bananoUtil = {
  generateRandomSeed: (): string => {
    return toHex(crypto.getRandomValues(new Uint8Array(32)));
  },

  encryptSeed: (seed: string, password: string): string => {
    return AES.encrypt(seed, password).toString();
  },

  decryptSeed: (ciphertext: string, password: string): string => {
    return AES.decrypt(ciphertext, password).toString(Utf8);
  },

  isSeedValid(seed: string): boolean {
    const { valid }: { valid: boolean } = bananojs.bananoUtil.isSeedValid(seed);
    return valid;
  },

  async loadAccountAtIndex(seed: string, index: number): Promise<BanAccount> {
    const privateKey = bananojs.getPrivateKey(seed, index);
    const publicKey = await bananojs.getPublicKey(privateKey);
    const address = bananojs.getBananoAccount(publicKey);
    const info = await bananojs.getAccountInfo(address);

    return {
      address: address,
      opened: info.error ? false : true,
    };
  },

  async loadAccounts(seed: string): Promise<BanAccount[]> {
    const banAccounts = [] as BanAccount[];
    banAccounts.push(await this.loadAccountAtIndex(seed, 0));

    // load other opened accounts
    for (let i = 1; ; i++) {
      const acc = await this.loadAccountAtIndex(seed, i);
      if (!acc.opened) break;
      else banAccounts.push(acc);
    }

    return banAccounts;
  },
};
