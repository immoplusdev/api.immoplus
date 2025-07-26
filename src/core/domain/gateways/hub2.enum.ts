export enum TransferStatus {
  CREATED = 'created', 
  SUCCESSFUL = 'successful', 
  PENDING = 'pending', 
  FAILED = 'failed'
}    

export enum TransferType {
  MOBILE_MONEY = 'mobile_money', 
  BANK_TRANSFER = 'bank_transfer', 
  AIRTIME = 'airtime' 
}


export enum TransferProvider {
  MoovMoney = "moov",
  Wave = "wave",
  OrangeMoney = "orange",
  MtnMoney = "mtn",
  Ecobank = "ecobank",
  Cash = "cash",
}

export enum TransferItemType {
  WALLET_WITHDRAWAL_REQUEST = 'walletWithDrawalRequest',
  ADMIN_WITHDRAWAL = 'admin_withdrawal',
}

export enum PaymentCollection {
  DemandeDeVisite = "demandes_visites",
  Reservation = "reservations",
  DemandeRetrait = "demandes_retraits",
}