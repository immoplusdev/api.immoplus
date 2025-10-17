import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyPinCommand } from "../verify-pin.command";
import { IWalletRepository } from "@/core/domain/wallet";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";

@CommandHandler(VerifyPinCommand)
export class VerifyPinHandler implements ICommandHandler<VerifyPinCommand> {
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(command: VerifyPinCommand): Promise<boolean> {
    return this.walletRepository.verifyPinCode(command.ownerId, command.pin);
  }
}
