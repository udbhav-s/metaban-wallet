import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import * as bananojs from "@bananocoin/bananojs";
import { BanAccount, Transaction } from "@/types";

function toHex(buffer: Uint8Array) {
  return Array.prototype.map
    .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export const bananoUtil = {
  defaultRep:
    "ban_1ka1ium4pfue3uxtntqsrib8mumxgazsjf58gidh1xeo5te3whsq8z476goo",

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

  signHash(hash: string, seed: string, index: number): string {
    const privateKey = bananojs.getPrivateKey(seed, index);
    return bananojs.signHash(privateKey, hash);
  },

  async sendTransaction(
    transaction: Transaction,
    seed: string,
    index: number
  ): Promise<string> {
    return await bananojs.sendAmountToBananoAccountWithRepresentativeAndPrevious(
      seed,
      index,
      transaction.destination,
      transaction.amount,
      transaction.representative
    );
  },

  async getAccount(address: string): Promise<BanAccount> {
    const account = { address } as BanAccount;
    const info = await bananojs.getAccountInfo(address, true);

    if (!info.error) {
      account.opened = true;
      account.representative = info.representative;
      const balance = bananojs.getBananoPartsFromRaw(info.balance);
      account.balance = `${balance.banano}.${balance.banoshi}`;
    } else {
      account.opened = false;
    }

    return account;
  },

  async loadAccountAtIndex(seed: string, index: number): Promise<BanAccount> {
    const privateKey = bananojs.getPrivateKey(seed, index);
    const publicKey = await bananojs.getPublicKey(privateKey);

    const address = bananojs.getBananoAccount(publicKey);
    return await this.getAccount(address);
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

  getAddressFromBlockHash(hash: string): string {
    return bananojs.bananoUtil.getAccount(hash, "ban_");
  },

  async receiveBlock(
    seed: string,
    index: number,
    hash: string,
    rep?: string
  ): Promise<string> {
    return await bananojs.receiveBananoDepositsForSeed(
      seed,
      index,
      rep ?? this.defaultRep,
      hash
    );
  },

  isAccountValid(address: string): boolean {
    return bananojs.getBananoAccountValidationInfo(address).valid;
  },
};
