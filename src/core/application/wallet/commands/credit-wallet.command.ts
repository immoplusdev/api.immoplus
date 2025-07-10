export class CreditWalletCommand {
    constructor(
        public ownerId: string, 
        public amount: number, 
        public reservationId?: string, 
        public currency?: string
    ) {}
}