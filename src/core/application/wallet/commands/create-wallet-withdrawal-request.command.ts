import { DEFAULT_CURRENCY, WithdrawalStatus } from "@/core/domain/wallet";

export class CreateWalletWithdrawalRequestCommand {

  constructor(
    public readonly owner: string,
    public readonly amount: number,
    public readonly currency: string = DEFAULT_CURRENCY,
    public readonly status: WithdrawalStatus = WithdrawalStatus.PENDING,
    public readonly note?: string
  ) {}
}