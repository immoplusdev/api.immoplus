export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  WITHDRAWAL = 'WITHDRAWAL'
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}