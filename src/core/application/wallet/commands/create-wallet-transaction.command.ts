import { User } from "@/core/domain/users";
import { DEFAULT_CURRENCY, TransactionType, Wallet } from "@/core/domain/wallet";

export class CreateWalletTransactionCommand {
  constructor(
    public readonly wallet: string,
    public readonly amount: number,
    public readonly type: TransactionType,
     public readonly currency: string = DEFAULT_CURRENCY,
    public readonly reference?: string,
    public readonly note? : string
  ) {}
}