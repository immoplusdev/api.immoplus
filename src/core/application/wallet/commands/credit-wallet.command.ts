import { PaymentMethod } from "@/core/domain/common/enums";
import { TransactionSource } from "@/core/domain/wallet";

export class CreditWalletCommand {
  constructor(
    public ownerId: string,
    public amount: number,
    public currency?: string,
    public source?: TransactionSource,
    public sourceId?: string,
    public operator?: PaymentMethod,
    public note?: string,
    public releaseDate?: Date,
  ) {}
}
