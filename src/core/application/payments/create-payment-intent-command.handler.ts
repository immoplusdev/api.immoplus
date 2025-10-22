import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreatePaymentIntentCommand } from "./create-payment-intent.command";
import { CreatePaymentIntentCommandResponse } from "./create-payment-intent-command.response";
import { Inject } from "@nestjs/common";
import {
  AttemptPaymentIntent,
  IPaymentGatewayService,
  IPaymentRepository,
  Payment,
  PaymentStatus,
  PaymentToken,
  PaymentCollectionItemData,
} from "@/core/domain/payments";
import { Deps } from "@/core/domain/common/ioc";
import { IReservationRepository } from "@/core/domain/reservations";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { GetPaymentCollectionItemDataQuery } from "./get-payment-collection-item-data.query";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

@CommandHandler(CreatePaymentIntentCommand)
export class CreatePaymentIntentCommandHandler
  implements ICommandHandler<CreatePaymentIntentCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(Deps.PaymentGatewayService)
    private readonly paymentGatewayService: IPaymentGatewayService,
  ) {
    //
  }

  async execute(
    command: CreatePaymentIntentCommand,
  ): Promise<CreatePaymentIntentCommandResponse> {
    const itemData = await this.queryBus.execute(
      new GetPaymentCollectionItemDataQuery({
        itemId: command.itemId,
        collection: command.collection,
      }),
    );
    console.log("Item Data:", itemData);
    if (!itemData) throw new ItemNotFoundException();

    const paymentIntent = await this.initializePayment(command, itemData);
    const payment = await this.attemptPayment(
      paymentIntent?.id as string,
      new AttemptPaymentIntent({
        paymentCredentials: command.paymentCredentials,
        paymentMethod: command.paymentMethod,
        paymentId: paymentIntent?.hub2PaymentId as string,
        token: paymentIntent?.hub2Token,
        collection: command.collection,
        itemId: command.itemId,
      }),
    );

    return {
      ...payment,
      customer: getIdFromObject(payment.customer),
      amount: payment.amount,
      collection: command.collection,
      itemId: command.itemId,
      paymentMethod: command.paymentMethod,
      paymentStatus: payment.paymentStatus,
      hub2NextAction: payment.hub2NextAction,
    };
  }

  async initializePayment(
    command: CreatePaymentIntentCommand,
    serviceData: PaymentCollectionItemData,
  ): Promise<Payment> {
    // const fees = this.paymentGatewayService.calculatePaymentFees(
    //   serviceData.amount,
    //   command.paymentMethod,
    // );
    // const amountNoFees = serviceData.amount;
    // const totalAmount = amountNoFees + fees;
    const totalAmount = serviceData.amount;

    const paymentIntentResponse =
      await this.paymentGatewayService.createPaymentIntent({
        customerId: command.userId,
        paymentToken: new PaymentToken({
          collection: serviceData.collection,
          itemId: serviceData.itemId,
        }),
        amount: totalAmount,
        paymentMethod: command.paymentMethod,
      });

    return await this.paymentRepository.createOne({
      amount: totalAmount,
      amountNoFees: serviceData.amountNoFees,
      collection: serviceData.collection,
      paymentStatus: paymentIntentResponse.status,
      paymentMethod: command.paymentMethod,
      itemId: serviceData.itemId,
      hub2Token: paymentIntentResponse.token,
      hub2PaymentId: paymentIntentResponse.id,
      customer: command.userId,
    });
  }

  async attemptPayment(
    paymentId: string,
    command: AttemptPaymentIntent,
  ): Promise<Payment> {
    const response = await this.paymentGatewayService.attemptPayment(command);
    await this.paymentRepository.updateOne(paymentId, {
      hub2NextAction: response.nextAction,
      paymentStatus: response?.status as PaymentStatus,
      hub2Token: response.token,
      hub2Metadata: response.metadata
        ? response.metadata
        : (JSON.stringify(response) as never),
    });

    return await this.paymentRepository.findOne(paymentId);
  }
}
