import { PaymentMethod } from "@/core/domain/common/enums";
import { DEFAULT_CURRENCY, WithdrawalStatus } from "@/core/domain/wallet";

export class CreateWalletWithdrawalRequestCommand {

  constructor(
    public readonly owner: string,
    public readonly amount: number,
    public readonly currency: string = DEFAULT_CURRENCY,
    public readonly phoneNumber: string,
    public readonly operator: PaymentMethod,
    public readonly status: WithdrawalStatus = WithdrawalStatus.PENDING,
    public readonly note?: string
  ) {}
}