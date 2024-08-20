import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePaymentIntentCommand } from "./create-payment-intent.command";
import { CreatePaymentIntentCommandResponse } from "./create-payment-intent-command.response";
import { Inject } from "@nestjs/common";
import {
  AttemptPaymentIntent,
  IPaymentGatewayService,
  IPaymentRepository,
  Payment,
  PaymentCollection, PaymentStatus,
  PaymentToken,
  PaymentCollectionItemDataModel,
} from "@/core/domain/payments";
import { Deps } from "@/core/domain/shared/ioc";
import { IReservationRepository } from "@/core/domain/reservations";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";

@CommandHandler(CreatePaymentIntentCommand)
export class CreatePaymentIntentCommandHandler implements ICommandHandler<CreatePaymentIntentCommand> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.PaymentRepository) private readonly paymentRepository: IPaymentRepository,
    @Inject(Deps.PaymentGatewayService) private readonly paymentGatewayService: IPaymentGatewayService,
  ) {
    //
  }

  async execute(command: CreatePaymentIntentCommand): Promise<CreatePaymentIntentCommandResponse> {

    const itemData = await this.getItemData(command);
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
      customerId: payment.customerId,
      amount: payment.amount,
      collection: command.collection,
      itemId: command.itemId,
      paymentMethod: command.paymentMethod,
      paymentStatus: payment.paymentStatus,
      hub2NextAction: payment.hub2NextAction,
    };
  }

  async getItemData(command: CreatePaymentIntentCommand): Promise<PaymentCollectionItemDataModel> {
    const itemData = new PaymentCollectionItemDataModel();

    if (command.collection == PaymentCollection.Reservation) {
      const data = await this.reservationRepository.findOne(command.itemId);
      itemData.setData({
        itemId: data.id,
        collection: PaymentCollection.Reservation,
        amount: data.montantTotalReservation,
      });
    } else {
      const data = await this.demandeVisiteRepository.findOne(command.itemId);
      itemData.setData({
        itemId: data.id,
        collection: PaymentCollection.Reservation,
        amount: data.montantTotalDemandeVisite,
      });
    }

    return itemData;
  }

  async initializePayment(
    command: CreatePaymentIntentCommand,
    serviceData: PaymentCollectionItemDataModel,
  ): Promise<Payment> {


    const fees = this.paymentGatewayService.calculatePaymentFees(serviceData.amount, command.paymentMethod);
    const amountNoFees = serviceData.amount;
    const totalAmount = amountNoFees + fees;

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
      amountNoFees: amountNoFees,
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
      hub2Metadata: response.metadata,
    });

    return await this.paymentRepository.findOne(paymentId);
  }
}
