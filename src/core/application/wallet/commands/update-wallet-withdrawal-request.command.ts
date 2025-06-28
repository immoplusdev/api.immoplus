import { WalletOperators, WithdrawalStatus } from "@/core/domain/wallet"

export class UpdateWalletWithdrawalRequestCommand {
    constructor(
        public id: string, 
        public amount: number,
        public currency: string,
        public phoneNumber: string,
        public operator: WalletOperators,
        public status: WithdrawalStatus,
        public note?: string
    ) {}
}