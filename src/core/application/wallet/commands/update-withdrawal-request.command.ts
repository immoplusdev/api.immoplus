import { WithdrawalStatus } from "@/core/domain/wallet";

export class updateWithdrawalRequestCommand {
    id: string;
    status: WithdrawalStatus;
    note?: string;

    constructor(data?: Partial<updateWithdrawalRequestCommand>) {
        if (data) Object.assign(this, data);
    }
}