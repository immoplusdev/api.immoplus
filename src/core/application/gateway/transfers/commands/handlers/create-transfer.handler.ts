import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTransferCommand } from "../create-transfer.command";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { ITransferRepository } from "@/core/domain/transfers/i-transfer.repository";
import { IWalletRepository, WithdrawalStatus } from "@/core/domain/wallet";
import { IGatewayRepository } from "@/core/domain/gateways/i-gateway.repository";
import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "@/core/domain/users";
import { Transfer } from "@/core/domain/transfers/transfer.model";
import {
  TransferItemType,
  TransferStatus,
  TransferType,
} from "@/core/domain/transfers/transfer.enum";
import {
  DestinationMobile,
  Origin,
  TransfertPayloadDto,
} from "@/core/domain/gateways/transfers/transfert-payload.dto";
import { Hu2TransferResponseDto } from "@/core/domain/gateways/transfers/hu2-transfer-response.dto";
import {
  getProviderHub2,
  getTransferMethodFees,
} from "../../../utils/hub2.utils";

@CommandHandler(CreateTransferCommand)
export class CreateTransferHandler
  implements ICommandHandler<CreateTransferCommand>
{
  constructor(
    @Inject(Deps.GatewayRepository)
    private readonly gatewayRespository: IGatewayRepository,
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
    @Inject(Deps.TransferRepository)
    private readonly transferRepository: ITransferRepository,
    @Inject(Deps.UsersRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateTransferCommand): Promise<Transfer> {
    const withdrawal =
      await this.walletRepository.findWalletWithdrawalRequestById(
        command.walletWithDrawalRequestId,
      );
    if (!withdrawal) {
      throw new Error("Withdrawal request not found");
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new Error("Withdrawal request is not pending");
    }

    /** Get user info */
    const userId =
      typeof withdrawal.owner === "string"
        ? withdrawal.owner
        : withdrawal.owner.id;
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new Error("User not found");
    }

    /** Register the transfer in system */
    const fees = await getTransferMethodFees(
      withdrawal.amount,
      withdrawal.operator,
    );
    const amount = +withdrawal.amount - fees;
    const userName = user.firstName + " " + user.lastName;

    const transferData = new Transfer({
      id: uuidv4(),
      amount: amount,
      currency: withdrawal.currency,
      fees: fees,
      customer: user.id,
      itemType: TransferItemType.WALLET_WITHDRAWAL_REQUEST,
      itemId: withdrawal.id,
      transfetStatus: TransferStatus.CREATED,
      transferType: TransferType.MOBILE_MONEY,
      country: user.country || "CI",
      accountNumber: withdrawal.phoneNumber,
      bank: null,
      recipientName: userName,
      transferProvider: withdrawal.operator,
    });
    const transfer = await this.transferRepository.createOne(transferData);

    /** Initialize transfer payload to Hu2 */
    const destination = new DestinationMobile({
      type: transfer.transferType,
      country: transfer.country,
      msisdn: withdrawal.phoneNumber,
      provider: getProviderHub2(withdrawal.operator),
      recipientName: transfer.recipientName,
    });

    const origin = new Origin({
      name: "Immoplus",
      country: transfer.country,
    });

    const transferPayload = new TransfertPayloadDto({
      reference: transfer.id,
      amount: +withdrawal.amountWithFees,
      currency: transfer.currency,
      description: transfer.recipientName,
      destination: destination,
      origin: origin,
    });

    try {
      const hub2Response: Hu2TransferResponseDto =
        await this.gatewayRespository.createTransfer(transferPayload);
      console.log("hub2Response: ", hub2Response);
      await this.transferRepository.updateOne(transfer.id, {
        hub2TransferId: hub2Response.id,
        hub2Exception: null,
        hub2Metadata: hub2Response,
      });
    } catch (error) {
      await this.transferRepository.updateOne(transfer.id, {
        hub2TransferId: null,
        hub2Exception: error,
        hub2Metadata: null,
      });
      throw error;
    }

    this.walletRepository.updateWalletWithdrawalRequest(withdrawal.id, {
      status: WithdrawalStatus.APPROVED,
    });

    return transfer;
  }
}
