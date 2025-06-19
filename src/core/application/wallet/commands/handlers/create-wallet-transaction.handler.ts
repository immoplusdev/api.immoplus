import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateWalletTransactionCommand } from "../create-wallet-transaction.command";
import { Deps } from "@/core/domain/common/ioc";
import { Inject } from "@nestjs/common";
import { IWalletRepository, Wallet, WalletTransaction } from "@/core/domain/wallet";

@CommandHandler(CreateWalletTransactionCommand)
export class CreateWalletTransactionHandler implements ICommandHandler<CreateWalletTransactionCommand> {
  constructor(
    @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
  ) {}

  async execute(command: CreateWalletTransactionCommand): Promise<WalletTransaction> {
    const transaction = await this.walletRepository.createWalletTransaction(command);
    return transaction;
  }
}