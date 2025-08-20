import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "../users";
import { WalletTransaction } from "./wallet-transaction.model";

export class Wallet {
  id: string;
  owner: User | string;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  walletTransactions?: WalletTransaction[] | string[]; // Array of transaction IDs
  withDrawalRequest?: WalletTransaction[] | string[]; // Array of withdrawal request IDs

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data?: OmitMethods<Partial<Wallet>>) {
    if (data) Object.assign(this, data);
  }
}
