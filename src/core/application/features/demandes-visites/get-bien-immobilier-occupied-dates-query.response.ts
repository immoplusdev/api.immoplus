import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";

export class GetBienImmobilierOccupiedDatesQueryResponse {
  dates: ServiceDates;
  constructor(data?: OmitMethods<GetBienImmobilierOccupiedDatesQueryResponse>) {
    if (data) Object.assign(this, data);
  }
}
