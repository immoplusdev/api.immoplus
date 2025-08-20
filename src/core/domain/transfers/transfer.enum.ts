export enum TransferStatus {
  CREATED = "created",
  SUCCESSFUL = "successful",
  PENDING = "pending",
  FAILED = "failed",
}

export enum TransferType {
  MOBILE_MONEY = "mobile_money",
  BANK_TRANSFER = "bank_transfer",
  AIRTIME = "airtime",
}

export enum TransferItemType {
  WALLET_WITHDRAWAL_REQUEST = "wallet_withdrawal_request",
  ADMIN_WITHDRAWAL = "admin_withdrawal",
}
