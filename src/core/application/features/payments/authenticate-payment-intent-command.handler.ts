import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { AuthenticatePaymentIntentCommand } from "./authenticate-payment-intent.command";
import { AuthenticatePaymentIntentCommandResponse } from "./authenticate-payment-intent-command.response";
import {
  AuthenticatePaymentIntent, InvalidPaymentOtpException,
  IPaymentGatewayService,
  IPaymentRepository, Payment,
} from "@/core/domain/payments";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IReservationRepository } from "@/core/domain/reservations";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";
import {
  GetPaymentCollectionItemDataQuery,
} from "@/core/application/features/payments/get-payment-collection-item-data.query";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";
import { AppProfile } from "@/core/domain/shared/enums";
import { IConfigsManagerService } from "@/core/domain/configs";

@CommandHandler(AuthenticatePaymentIntentCommand)
export class AuthenticatePaymentIntentCommandHandler implements ICommandHandler<AuthenticatePaymentIntentCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.PaymentRepository) private readonly paymentRepository: IPaymentRepository,
    @Inject(Deps.PaymentGatewayService) private readonly paymentGatewayService: IPaymentGatewayService,
  ) {
    //
  }

  async execute(command: AuthenticatePaymentIntentCommand): Promise<AuthenticatePaymentIntentCommandResponse> {
    const payment = await this.getPayment(command);
    const response = { ...payment, customer: getIdFromObject(payment.customer) };
    if (this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") == AppProfile.Dev) {
      return response;
    }

    try {
      await this.paymentGatewayService.authenticatePayment(
        new AuthenticatePaymentIntent({
          otp: command.otp,
          paymentId: payment.hub2PaymentId,
          token: payment.hub2Token,
        }),
      );
    } catch (error) {
      throw new InvalidPaymentOtpException();
    }

    return response;
  }

  async getPayment(command: AuthenticatePaymentIntentCommand): Promise<Payment> {

    const itemData = await this.queryBus.execute(new GetPaymentCollectionItemDataQuery({
      itemId: command.itemId,
      collection: command.collection,
    }));
    if (!itemData) throw new ItemNotFoundException();

    const payments = await this.paymentRepository.findByQuery({
      _where: [
        {
          _field: "collection",
          _val: itemData.collection,
        },
        {
          _field: "itemId",
          _val: itemData.itemId,
        },
      ],
    });

    if (payments.data.length == 0) throw new ItemNotFoundException();
    return payments.data[payments.data.length - 1] as Payment;
  }
}
