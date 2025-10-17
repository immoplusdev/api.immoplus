import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SetPinCommand } from "../set-pin.command";
import { IWalletRepository } from "@/core/domain/wallet";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";

@CommandHandler(SetPinCommand)
export class SetPinHandler implements ICommandHandler<SetPinCommand> {
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(command: SetPinCommand): Promise<void> {
    return this.walletRepository.setPinCode(command.ownerId, command.pin);
  }
}
