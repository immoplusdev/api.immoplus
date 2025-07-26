import { TransferType } from "./hub2.enum";


export class TransfertPayloadModel {
    reference: string;
    amount: number;
    currency: string;
    description: string;
    destination: DestinationMobile | DestinationBank;
    origin: origin;
    overrideBusinessName: string;
    overrideBusinessId: string;

    constructor(data?: Partial<TransfertPayloadModel>) {
        Object.assign(this, data);
    }
}

export class origin{
    name: string;
    country: string;
}

export class DestinationMobile{
    type: TransferType;
    country: string;
    msisdn: string;
    provider: string;
    recipientName: string;

    constructor(data?: DestinationMobile) {
        Object.assign(this, data);
    }
}

export class DestinationBank{
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