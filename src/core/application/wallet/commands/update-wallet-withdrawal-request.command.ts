import { PaymentMethod } from "@/core/domain/common/enums";
import { WithdrawalStatus } from "@/core/domain/wallet"

export class UpdateWalletWithdrawalRequestCommand {
    constructor(
        public id: string, 
        public amount: number,
        public currency: string,
        public phoneNumber: string,
        public operator: PaymentMethod,
        public status: WithdrawalStatus,
        public note?: string
    ) {}
}