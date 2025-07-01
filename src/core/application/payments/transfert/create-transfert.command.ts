export class CreateTransfertCommand {
    constructor(
        public readonly reference: string,
        public readonly amount: number,
        public readonly currency: string,
        public readonly description: string,
        public readonly destination: {
            type: string,
            country: string,
            recipientName: string,
            msisdn: string,
            provider: string
        }
    ) {}
}