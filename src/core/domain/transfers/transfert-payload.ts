import { TransferType } from "./transfer.enum";

export class origin{
    name: string;
    country: string;
}

export class destinationMobile{
    type: TransferType;
    country: string;
    msisdn: string;
    provider: string;
    recipientName: string;

    constructor(data?: destinationMobile) {
        Object.assign(this, data);
    }
}

export class destinationBank{
    type: TransferType;
    country: string;
    accountNumber: string;
    accountOwner: string;
    bankCode: string;
    bankName: string;
    beneficiaryPhone: string;
    beneficiaryName: string;

    constructor(data?: destinationBank) {
        Object.assign(this, data);
    }
}


export class TransfertPayload {
    reference: string;
    amount: number;
    currency: string;
    description: string;
    destination: destinationMobile | destinationBank;
    origin: origin;
    overrideBusinessName: string;
    overrideBusinessId: string;

    constructor(data?: Partial<TransfertPayload>) {
        Object.assign(this, data);
    }
}