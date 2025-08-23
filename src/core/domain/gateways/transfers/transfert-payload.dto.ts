import { TransferType } from "../hub2.enum";

export class Origin {
  name: string;
  country: string;

  constructor(data?: Origin) {
    Object.assign(this, data);
  }
}

export class DestinationMobile {
  type: TransferType;
  country: string;
  msisdn: string;
  provider: string;
  recipientName: string;

  constructor(data?: DestinationMobile) {
    Object.assign(this, data);
  }
}

export class DestinationBank {
  type: TransferType;
  country: string;
  accountNumber: string;
  accountOwner: string;
  bankCode: string;
  bankName: string;
  beneficiaryPhone: string;
  beneficiaryName: string;

  constructor(data?: DestinationBank) {
    Object.assign(this, data);
  }
}

export class TransfertPayloadDto {
  reference: string;
  amount: number;
  currency: string;
  description: string;
  destination: DestinationMobile | DestinationBank;
  origin: Origin;
  overrideBusinessName?: string;
  overrideBusinessId?: string;

  constructor(data?: Partial<TransfertPayloadDto>) {
    Object.assign(this, data);
  }
}
