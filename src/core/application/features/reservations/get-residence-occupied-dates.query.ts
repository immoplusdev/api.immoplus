import { OmitMethods } from '@/lib/ts-utilities';

export class GetResidenceOccupiedDatesQuery {
  residenceId: string;
  constructor(data?: OmitMethods<GetResidenceOccupiedDatesQuery>) {
    if(data) Object.assign(this, data);
  }
}
