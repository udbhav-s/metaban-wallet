import * as bananojs from "@bananocoin/bananojs";

function toHex(buffer: Uint8Array) {
  return Array.prototype.map
    .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export const bananoUtil = {
  generateRandomSeed: (): string => {
    return toHex(crypto.getRandomValues(new Uint8Array(32)));
  },
};
