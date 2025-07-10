import { TransactionSource, WalletOperators } from "@/core/domain/wallet";

export class CreditWalletCommand {
    constructor(
        public ownerId: string, 
        public amount: number, 
        public currency?: string,
        public source?: TransactionSource, 
        public sourceId?: string,
        public operator?: WalletOperators,
        public note?: string,
        public releaseDate?: Date
    ) {}
}