import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository, Wallet } from "@/core/domain/wallet";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReleaseFundsCommand } from "../release-funds.command";

@CommandHandler(ReleaseFundsCommand)
export class ReleaseFundsHandler
  implements ICommandHandler<ReleaseFundsCommand>
{
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  execute(command: ReleaseFundsCommand): Promise<Wallet> {
    return this.walletRepository.releaseFunds(
      command.ownerId,
      command.amount,
      command.currency,
      command.source,
      command.sourceId,
      command.note,
    );
  }
}
