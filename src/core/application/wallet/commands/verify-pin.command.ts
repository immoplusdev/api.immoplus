export class VerifyPinCommand {
  constructor(
    public ownerId: string,
    public pin: string,
  ) {}
}