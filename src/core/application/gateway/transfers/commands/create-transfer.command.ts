export class CreateTransferCommand {
  constructor(
    public readonly walletWithDrawalRequestId: string,
    public readonly description: string,
  ) {}
}
