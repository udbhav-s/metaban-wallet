import { Transaction } from "./transaction";

export interface SignData {
  type: "hash" | "transaction";
  hash?: string;
  transaction?: Transaction;
  address?: string;
}
