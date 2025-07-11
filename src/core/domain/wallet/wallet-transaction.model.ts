import { OmitMethods } from "@/lib/ts-utilities";
import { Wallet } from "./wallet.model";
import { TransactionSource, TransactionType, WalletOperators } from "./wallet.enum";

export class WalletTransaction {
  id: string;
  wallet: Wallet | string;
  type: TransactionType;
  amount: number;
  currency: string;
  source?: TransactionSource;
  sourceId?: string;
  operator?: WalletOperators;
  note?: string;
  releaseDate?: Date; // Date à laquelle il faut reversement de la transaction
  isRealeased?: boolean; // Indique si la transaction a deja ete reversee
  releasedAt?: Date;   // Date de reversement

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;

  constructor(data?: OmitMethods<Partial<WalletTransaction>>) {
    if (data) Object.assign(this, data);
  }
}


