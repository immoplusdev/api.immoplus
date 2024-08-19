import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { AnnulerReservationByIdCommand } from "./annuler-reservation-by-id.command";
import { AnnulerReservationByIdCommandResponse } from "./annuler-reservation-by-id-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IReservationRepository, Reservation, StatusReservation } from "@/core/domain/reservations";
import { UnexpectedException } from "@/core/domain/shared/exceptions";
import { GetReservationByIdQuery } from "@/core/application/features/reservations/get-reservation-by-id.query";

@CommandHandler(AnnulerReservationByIdCommand)
export class AnnulerReservationByIdCommandHandler implements ICommandHandler<AnnulerReservationByIdCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
  ) {
    //
  }

  async execute(command: AnnulerReservationByIdCommand): Promise<AnnulerReservationByIdCommandResponse> {

    const reservation = await this.reservationRepository.findOne(command.reservation, { fields: ["id", "statusReservation"] });

    try {
      this.verifyCanProceed(reservation.statusReservation, command.userId);
    } catch (err) {
      return await this.queryBus.execute(new GetReservationByIdQuery({ id: command.reservation }));
    }


    const payload: Partial<Reservation> = {
      statusReservation: StatusReservation.Rejete,
    };

    if (command.notes) payload.notes = command.notes;

    await this.reservationRepository.updateOne(command.reservation, payload);

    return await this.queryBus.execute(new GetReservationByIdQuery({ id: command.reservation }));
  }

  private verifyCanProceed(statusReservation: StatusReservation, _userId: string) {
    if (statusReservation == StatusReservation.Valide || statusReservation == StatusReservation.Rejete) throw new UnexpectedException();
  }
}
