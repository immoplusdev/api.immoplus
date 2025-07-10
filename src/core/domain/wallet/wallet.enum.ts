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


export enum WalletOperators {
  MoovMoney = "moov",
  Wave = "wave",
  OrangeMoney = "orange",
  MtnMoney = "mtn",
  Ecobank = "ecobank",
  Cash = "cash",
} 

export enum TransactionSource {
   RESERVATION = 'RESERVATION',
   DEMANDE_VISITE = 'DEMANDE_VISITE',
   DEMANDE_RETRAIT = 'DEMANDE_RETRAIT',
   DEMANDE_RETRAIT_ADMIN = 'DEMANDE_RETRAIT_ADMIN',
   AUTRE = 'AUTRE'
}