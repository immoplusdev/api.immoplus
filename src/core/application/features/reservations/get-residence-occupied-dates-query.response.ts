import { OmitMethods } from '@/lib/ts-utilities';
import { ServiceDates } from "@/core/domain/shared/models";

export class GetResidenceOccupiedDatesQueryResponse {
  dates: ServiceDates;
  constructor(data?: OmitMethods<GetResidenceOccupiedDatesQueryResponse>) {
    if(data) Object.assign(this, data);
  }
}
