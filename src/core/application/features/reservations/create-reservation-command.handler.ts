import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateReservationCommand } from "./create-reservation.command";
import { CreateReservationCommandResponse } from "./create-reservation-command.response";
import {
  EstimerPrixReservationQuery,
  GetReservationByIdQuery,
  GetResidenceOccupiedDatesQuery,
} from "@/core/application/features/reservations";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IResidenceRepository } from "@/core/domain/residences";
import { DateReservationDejaPriseException, IReservationRepository } from "@/core/domain/reservations";
import { IUserRepository } from "@/core/domain/users";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";
import { ServiceDates } from "@/core/domain/shared/models";
import {
  GetResidenceOccupiedDatesQueryResponse,
} from "@/core/application/features/reservations";


@CommandHandler(CreateReservationCommand)
export class CreateReservationCommandHandler implements ICommandHandler<CreateReservationCommand> {
  constructor(
    readonly queryBus: QueryBus,
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUserRepository,
    @Inject(Deps.ResidenceRepository) private readonly residenceRepository: IResidenceRepository,
  ) {
    //
  }

  async execute(command: CreateReservationCommand): Promise<CreateReservationCommandResponse> {

    await this.verifyCanCreateReservation(command);

    const calculationResult = await this.queryBus.execute(new EstimerPrixReservationQuery({ ...command }));

    const residence = await this.residenceRepository.findOne(command.residence, { fields: ["id", "proprietaire"] });
    if (!residence) throw new ItemNotFoundException();


    if (!command.clientPhoneNumber) {
      const client = await this.usersRepository.findOne(command.userId, { relations: [], fields: ["id", "phoneNumber"] });
      command.setClientPhoneNumber(client.phoneNumber);
    }


    const { id } = await this.reservationRepository.createOne({
      ...command,
      montantTotalReservation: calculationResult.montantTotalReservation,
      montantReservationSansCommission: calculationResult.montantReservationSansCommission,
      clientPhoneNumber: command.clientPhoneNumber,
      createdBy: command.userId,
    }, false);



    return await this.queryBus.execute(new GetReservationByIdQuery({ id }));
  }

  private async verifyCanCreateReservation(command: CreateReservationCommand) {
    const occupiedDatesResponse = await this.queryBus.execute<GetResidenceOccupiedDatesQuery, GetResidenceOccupiedDatesQueryResponse>(
      new GetResidenceOccupiedDatesQuery({
        residenceId: command.residence,
      }));

    const previousReservationDates = this.serviceDatesToDates(occupiedDatesResponse.dates);
    const newReservationDates = this.serviceDatesToDates(command.datesReservation);

    for (const date of newReservationDates) {
      if (previousReservationDates.includes(date)) {
        throw new DateReservationDejaPriseException(date);
      }
    }
  }

  private serviceDatesToDates(serviceDates: ServiceDates) {
    return serviceDates.map(serviceDate => this.dateToString(serviceDate.date));
  }

  private dateToString(date: Date) {
    const dateTime = new Date(date);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth();
    const day = dateTime.getDate();
    return new Date(year, month, day).toISOString();
  }
}
