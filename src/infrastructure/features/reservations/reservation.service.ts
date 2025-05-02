import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Deps } from "@/core/domain/common/ioc";
import { IReservationRepository, StatusReservation } from "@/core/domain/reservations";
import { ILoggerService } from "@/core/domain/logging";
import * as moment from "moment";
import { StatusFacture } from "@/core/domain/payments";

@Injectable()
export class ReservationService {
  constructor(
    @Inject(Deps.LoggerService)
    private readonly loggerService: ILoggerService,
    @Inject(Deps.ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
  ) {
  }


  @Cron(CronExpression.EVERY_30_MINUTES)
  // @Cron("0 */12 * * *")
  async refreshReservationStatus() {
    this.loggerService.info("Refreshing reservation status");
    const reservations = await this.reservationRepository.findByQuery({
      _where: [
        { _field: "statusReservation", _op: "neq", _val: StatusReservation.Terminee },
        { _field: "statusFacture", _op: "eq", _val: StatusFacture.Paye },
      ],
    });

    const reservationIds = [];
    const today = moment().format("YYYY-MM-DD");

    for (const reservation of reservations.data) {
      const dateReservation = reservation.datesReservation
        .sort((item1, item2) => moment(item1.date).diff(moment(item2.date)))
        .map(item => item.date)[0];

      if (dateReservation && moment(dateReservation).isAfter(today, "day")) {
        this.loggerService.info(`${dateReservation} is after ${today}`);
        reservationIds.push(reservation.id);
      }
    }

    await this.reservationRepository.updateByQuery({
      _where: [{ _field: "id", _op: "in", _val: reservationIds }],
    }, { statusReservation: StatusReservation.Terminee, updatedAt: today as never });
  }
}
