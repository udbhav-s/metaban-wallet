/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Asset, Template } from "@/types";

export const metanodeUtil = {
  metanodeUrl: "https://nft.coranos.cc",
  ipfsUrl: "https://gateway.ipfs.io/ipfs/",

  async fetchRpc(body: unknown) {
    const reponse = await fetch(this.metanodeUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseJson = await reponse.json();
    if (responseJson.success) return responseJson;
    else throw new Error("Error in querying metanode" + responseJson);
  },

  async getTemplate(cid: string): Promise<Template> {
    const response = await fetch(new URL(cid, this.ipfsUrl).toString());
    return await response.json();
  },

  async getAssetsOwnedByAccount(address: string): Promise<Asset[]> {
    const response = await this.fetchRpc({
      action: "get_nft_owner_assets",
      owner: address,
    });
    const assets = response.asset_owners as (Asset & {
      templateData?: Template;
    })[];

    // fetch template data asychronously
    const promises = [];
    for (const asset of assets) {
      promises.push(
        (async () => {
          asset.templateData = await this.getTemplate(asset.template);
        })()
      );
    }
    await Promise.all(promises);

    return assets;
  },

  async getAssetHistory(hash: string): Promise<Asset> {
    const response = await this.fetchRpc({
      action: "get_nft_asset_owner",
      asset_hash: hash,
    });

    if (!response.asset_owner) throw new Error("No valid data in response");
    else return response.asset_owner as Asset;
  },
};
