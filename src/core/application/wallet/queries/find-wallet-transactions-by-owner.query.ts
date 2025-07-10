import { SearchItemsParams } from "@/core/domain/http";

export class FindWalletTransactionsByOwnerQuery {
    constructor(public readonly query: SearchItemsParams) {}
}