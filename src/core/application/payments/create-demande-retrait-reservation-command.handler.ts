import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateDemandeRetraitReservationCommand } from "./create-demande-retrait-reservation.command";
import { IPaymentRepository, Payment, PaymentCollection, PaymentStatus, PaymentType } from "@/core/domain/payments";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IReservationRepository, Reservation, StatusReservation } from "@/core/domain/reservations";
import { ConflictException, ItemNotFoundException } from "@/core/domain/common/exceptions";

@CommandHandler(CreateDemandeRetraitReservationCommand)
export class CreateDemandeRetraitReservationCommandHandler implements ICommandHandler<CreateDemandeRetraitReservationCommand> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.PaymentRepository) private readonly paymentRepository: IPaymentRepository,
  ) {

  }

  async execute(command: CreateDemandeRetraitReservationCommand): Promise<Payment> {

    const reservation = await this.reservationRepository.findOne(command.reservationId);
    await this.ensureCanProceed(command, reservation);

    const amountWithFees = Math.round(reservation.montantTotalReservation * 10 / 100);

    return await this.paymentRepository.createOne({
      amount: amountWithFees,
      amountNoFees: reservation.montantTotalReservation,
      customer: command.userId,
      paymentType: PaymentType.Retrait,
      collection: PaymentCollection.Reservation,
      paymentStatus: PaymentStatus.WaitingForValidation,
      paymentMethod: command.paymentMethod,
      itemId: reservation.id,
      paymentAddress: command.paymentAddress,
    });
  }

  private async ensureCanProceed(command: CreateDemandeRetraitReservationCommand, reservation: Reservation) {

    if (!reservation) throw new ItemNotFoundException();
    if (reservation.statusReservation != StatusReservation.Valide) throw new ConflictException("$t:all.exception.reservation_pas_encore_validee");

    const existingDemandesRetrait = await this.paymentRepository.findByQuery({
      _where: [
        {
          _field: "collection",
          _op: "eq",
          _val: PaymentCollection.Reservation,
          _l_op: "and",
        },
        {
          _field: "paymentStatus",
          _op: "neq",
          _val: PaymentStatus.Successful,
          _l_op: "and",
        },
        {
          _field: "paymentType",
          _op: "eq",
          _val: PaymentType.Retrait,
          _l_op: "and",
        },
        {
          _field: "itemId",
          _op: "eq",
          _val: command.reservationId,
          _l_op: "and",
        },
      ],
    });

    if (existingDemandesRetrait.data.length != 0) throw new ConflictException("$t:all.exception.existing_demande_retrait_reservation");
  }
}
