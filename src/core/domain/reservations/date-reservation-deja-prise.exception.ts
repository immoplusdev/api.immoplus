import { BaseException } from "@/core/domain/shared/exceptions";

export class DateReservationDejaPriseException extends BaseException {
  constructor(date?: Date | string) {
    super("$t:all.exception.date_reservation_deja_prise", 400);
    this.setData({ date });
  }
}
