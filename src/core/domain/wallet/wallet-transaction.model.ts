import { OmitMethods } from "@/lib/ts-utilities";
import { Wallet } from "./wallet.model";
import { TransactionType } from "./wallet.enum";

export class WalletTransaction {
  id: string;
  wallet: Wallet | string;
  type: TransactionType;
  amount: number;
  currency: string;
  reference: string;
  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;

  constructor(data?: OmitMethods<Partial<WalletTransaction>>) {
    if (data) Object.assign(this, data);
  }
}


