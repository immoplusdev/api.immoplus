export class ReleaseFundsCommand {
    constructor(
        public readonly ownerId: string,
        public readonly amount: number,
        public readonly reservationId: string,
        public readonly currency?: string
    ) {}
}