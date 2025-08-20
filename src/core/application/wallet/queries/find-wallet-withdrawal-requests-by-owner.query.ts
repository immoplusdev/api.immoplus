import { SearchItemsParams } from "@/core/domain/http";

export class FindWalletWithdrawalRequestsByOwnerQuery {
  constructor(public readonly query: SearchItemsParams) {}
}
