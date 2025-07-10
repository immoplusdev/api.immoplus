import { TransactionSource } from "@/core/domain/wallet";

export class ReleaseFundsCommand {
    constructor(
        public readonly ownerId: string,
        public readonly amount: number,
        public readonly currency?: string,
        public readonly source?: TransactionSource,
        public readonly sourceId?: string,
        public readonly note?: string
    ) {}
}