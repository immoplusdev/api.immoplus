import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateReservationCommand } from "./create-reservation.command";
import { CreateReservationCommandResponse } from "./create-reservation-command.response";
import {
  EstimerPrixReservationQuery,
  EstimerPrixReservationQueryResponse,
  GetReservationByIdQuery,
  GetResidenceOccupiedDatesQuery,
} from "@/core/application/reservations";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IResidenceRepository } from "@/core/domain/residences";
import {
  DateReservationDejaPriseException,
  IReservationRepository,
} from "@/core/domain/reservations";
import { IUserRepository } from "@/core/domain/users";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { ServiceDates } from "@/core/domain/common/models";
import { GetResidenceOccupiedDatesQueryResponse } from "@/core/application/reservations";
import { dateToString } from "@/lib/ts-utilities";

@CommandHandler(CreateReservationCommand)
export class CreateReservationCommandHandler
  implements ICommandHandler<CreateReservationCommand>
{
  constructor(
    readonly queryBus: QueryBus,
    @Inject(Deps.ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
  ) {
    //
  }

  async execute(
    command: CreateReservationCommand,
  ): Promise<CreateReservationCommandResponse> {
    await this.verifyCanCreateReservation(command);

    const calculationResult: EstimerPrixReservationQueryResponse =
      await this.queryBus.execute(
        new EstimerPrixReservationQuery({ ...command }),
      );

    const residence = await this.residenceRepository.findOne(
      command.residence,
      { fields: ["id", "proprietaire", "heureEntree", "heureDepart"] },
    );
    if (!residence) throw new ItemNotFoundException();

    if (!command.clientPhoneNumber) {
      const client = await this.usersRepository.findOne(command.userId, {
        relations: [],
        fields: ["id", "phoneNumber"],
      });
      command.setClientPhoneNumber(client.phoneNumber);
    }

    const reserDates = await this.getStartAndEndDates(
      command.datesReservation,
      residence.heureEntree,
      residence.heureDepart,
    );
    const { id } = await this.reservationRepository.createOne(
      {
        ...command,
        ...reserDates,
        montantTotalReservation: calculationResult.montantTotalReservation,
        montantCommission: calculationResult.montantCommission,
        clientPhoneNumber: command.clientPhoneNumber,
        createdBy: command.userId,
      },
      false,
    );

    return await this.queryBus.execute(new GetReservationByIdQuery({ id }));
  }

  private async verifyCanCreateReservation(command: CreateReservationCommand) {
    const occupiedDatesResponse = await this.queryBus.execute<
      GetResidenceOccupiedDatesQuery,
      GetResidenceOccupiedDatesQueryResponse
    >(
      new GetResidenceOccupiedDatesQuery({
        residenceId: command.residence,
      }),
    );

    const previousReservationDates = this.serviceDatesToDates(
      occupiedDatesResponse.dates,
    );
    const newReservationDates = this.serviceDatesToDates(
      command.datesReservation,
    );

    for (const date of newReservationDates) {
      if (previousReservationDates.includes(date)) {
        throw new DateReservationDejaPriseException(date);
      }
    }
  }

  private serviceDatesToDates(serviceDates: ServiceDates) {
    return serviceDates.map((serviceDate) => dateToString(serviceDate.date));
  }

  getStartAndEndDates(
    datesReservation: ServiceDates,
    heureEntree: string,
    heureSortie: string,
  ) {
    const startDate = datesReservation[0]?.date;
    const endDate = datesReservation[datesReservation.length - 1]?.date;

    const startHours = heureEntree.split(":");
    const formatStartDate = new Date(startDate);
    if (startHours.length > 1) {
      formatStartDate.setHours(
        parseInt(startHours[0]),
        parseInt(startHours[1]),
        0,
        0,
      );
    }

    const endHours = heureSortie.split(":");
    if (endHours.length > 1) {
      endDate.setHours(parseInt(startHours[0]), parseInt(startHours[1]), 0, 0);
    }
    return { dateDebut: formatStartDate, dateFin: endDate };
  }
}
