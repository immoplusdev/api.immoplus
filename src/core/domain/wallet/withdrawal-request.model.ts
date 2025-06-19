import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "../users";
import { Wallet } from "./wallet.model";

export class WithDrawalRequest {
  id: string;
  owner: User | string; 
  wallet: Wallet | string;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data?: OmitMethods<Partial<WithDrawalRequest>>) {
    if (data) Object.assign(this, data);
  }
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}
