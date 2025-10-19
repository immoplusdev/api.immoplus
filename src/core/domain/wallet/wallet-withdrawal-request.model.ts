import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "../users";
import { Wallet } from "./wallet.model";
import { WithdrawalStatus } from "./wallet.enum";
import { PaymentMethod } from "../common/enums";

export class WalletWithDrawalRequest {
  id: string;
  owner: User | string;
  wallet: Wallet | string;
  amount: number;
  amountWithFees: number;
  currency: string;
  phoneNumber?: string;
  operator?: PaymentMethod;
  status: WithdrawalStatus;
  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data?: OmitMethods<Partial<WalletWithDrawalRequest>>) {
    if (data) Object.assign(this, data);
  }
}
