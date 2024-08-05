import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateReservationCommand } from "./create-reservation.command";
import { CreateReservationCommandResponse } from "./create-reservation-command.response";
import { EstimerPrixReservationQuery, GetReservationByIdQuery } from "@/core/application/features/reservations";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IResidenceRepository } from "@/core/domain/residences";
import { IReservationRepository } from "@/core/domain/reservations";
import { IUsersRepository } from "@/core/domain/users";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";

@CommandHandler(CreateReservationCommand)
export class CreateReservationCommandHandler implements ICommandHandler<CreateReservationCommand> {
  constructor(
    readonly queryBus: QueryBus,
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUsersRepository,
    @Inject(Deps.ResidenceRepository) private readonly residenceRepository: IResidenceRepository,
  ) {
    //
  }

  async execute(command: CreateReservationCommand): Promise<CreateReservationCommandResponse> {


    const calculationResult = await this.queryBus.execute(new EstimerPrixReservationQuery({ ...command }));

    const residence = await this.residenceRepository.findOne(command.residence, [ "proprietaire"]);
    if (!residence) throw new ItemNotFoundException();


    const client = await this.usersRepository.findOne(command.userId, ["id", "phoneNumber"]);
    // const proprietaire = await this.usersRepository.findOne(residence.proprietaire, ["id", "phoneNumber"]);

    const { id } = await this.reservationRepository.createOne({
      ...command,
      montantTotalReservation: calculationResult.montantTotalReservation,
      montantReservationSansCommission: calculationResult.montantReservationSansCommission,
      clientPhoneNumber: command.clientPhoneNumber || client.phoneNumber,
      createdBy: command.userId,
    }, false);

    return await this.queryBus.execute(new GetReservationByIdQuery({ id }));
  }
}
