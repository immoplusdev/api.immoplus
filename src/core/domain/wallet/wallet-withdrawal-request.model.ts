import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "../users";
import { Wallet } from "./wallet.model";
import { WalletOperators, WithdrawalStatus } from "./wallet.enum";

export class WalletWithDrawalRequest {
  id: string;
  owner: User | string; 
  wallet: Wallet | string;
  amount: number;
  currency: string;
  phoneNumber?: string;
  operator?: WalletOperators;
  status: WithdrawalStatus;
  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data?: OmitMethods<Partial<WalletWithDrawalRequest>>) {
    if (data) Object.assign(this, data);
  }
}
