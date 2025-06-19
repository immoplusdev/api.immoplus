import { OmitMethods } from "@/lib/ts-utilities";
import { Wallet } from "./wallet.model";

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

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  WITHDRAWAL = 'WITHDRAWAL'
}
