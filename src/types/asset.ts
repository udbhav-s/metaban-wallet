import { Template } from "./template";

export interface Asset {
  asset: string;
  mint_number: string;
  history?: {
    owner: string;
    receive: string;
    send: string;
  }[];
  owner: string;
  received: "true" | "false";
  receiving?: boolean;
  template: string;
  templateData: Template;
}
