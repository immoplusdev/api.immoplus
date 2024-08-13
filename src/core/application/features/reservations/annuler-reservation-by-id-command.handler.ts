import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AnnulerReservationByIdCommand } from "./annuler-reservation-by-id.command";
import { AnnulerReservationByIdCommandResponse } from "./annuler-reservation-by-id-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IReservationRepository, Reservation, StatusReservation } from "@/core/domain/reservations";
import { UnexpectedException } from "@/core/domain/shared/exceptions";

@CommandHandler(AnnulerReservationByIdCommand)
export class AnnulerReservationByIdCommandHandler implements ICommandHandler<AnnulerReservationByIdCommand> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
  ) {
    //
  }

  async execute(command: AnnulerReservationByIdCommand): Promise<AnnulerReservationByIdCommandResponse> {

    const reservation = await this.reservationRepository.findOne(command.reservationId, { fields: ["id", "statusReservation"] });

    try {
      this.verifyCanProceed(reservation.statusReservation, command.userId);
    } catch (err) {
      return await this.reservationRepository.findOne(command.reservationId);
    }


    const payload: Partial<Reservation> = {
      statusReservation: StatusReservation.Rejete,
    };

    if (command.notes) payload.notes = command.notes;

    await this.reservationRepository.updateOne(command.reservationId, payload);

    return await this.reservationRepository.findOne(command.reservationId);

  }

  private verifyCanProceed(statusReservation: StatusReservation, _userId: string) {
    if (statusReservation == StatusReservation.Valide || statusReservation == StatusReservation.Rejete) throw new UnexpectedException();
  }
}
