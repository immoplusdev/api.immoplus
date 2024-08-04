import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EstimerPrixReservationCommand } from "./estimer-prix-reservation.command";
import { EstimerPrixReservationCommandResponse } from "./estimer-prix-reservation-command.response";

@CommandHandler(EstimerPrixReservationCommand)
export class EstimerPrixReservationCommandHandler implements ICommandHandler<EstimerPrixReservationCommand> {
  constructor() {
    //
  }

  async execute(command: EstimerPrixReservationCommand): Promise<EstimerPrixReservationCommandResponse> {
    return new EstimerPrixReservationCommandResponse();
  }
}
