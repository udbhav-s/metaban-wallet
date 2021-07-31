export interface Template {
  command: "nft_template";
  version: string;
  title: string;
  issuer: string;
  max_supply: string;
  art_data_ipfs_cid: string;
  previous: string;
}
