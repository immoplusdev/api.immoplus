import { BaseException } from "@/core/domain/common/exceptions";

export class DateDemandeVisiteDejaPriseException extends BaseException {
  constructor(date?: Date | string) {
    super("$t:all.exception.date_demande_visite_deja_prise", 400);
    this.setData({ date });
  }
}
