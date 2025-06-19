import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { updateWithdrawalRequestCommand } from "../update-withdrawal-request.command";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository, WithDrawalRequest } from "@/core/domain/wallet";

@CommandHandler(updateWithdrawalRequestCommand)
export class UpdateWithdrawalRequestHandler implements ICommandHandler<updateWithdrawalRequestCommand> {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ) {}
    
    async execute(command: updateWithdrawalRequestCommand): Promise<WithDrawalRequest> {
        const withdrawalRequest = await this.walletRepository.updateWithdrawalRequest(command);
        return withdrawalRequest;
    }
}