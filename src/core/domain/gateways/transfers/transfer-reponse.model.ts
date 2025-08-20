export class TransferResponseModel {
  id: string;
  merchantId: string;
  createdAt: Date;
  updatedAt: Date;
  reference: string;
  description: Date;
  status: string;
  amount: string;
  currency: string;
  mode: string;
  destination?: Record<string, any>;
  fees?: Record<string, any>[];
  failureCause?: Record<string, any>;
  origin?: Record<string, any>;
  overrideBusinessName?: string;
  overrideBusinessId?: string;
  isIrt?: boolean;
  providerReference?: string;
  balanceBefore: number;
  balanceAfter: number;
  providerData?: any;
}
