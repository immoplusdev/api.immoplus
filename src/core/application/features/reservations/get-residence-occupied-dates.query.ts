import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";

export class GetResidenceOccupiedDatesQuery {
  @ApiProperty({ format: "uuid" })
  residenceId: string;
  constructor(data?: OmitMethods<GetResidenceOccupiedDatesQuery>) {
    if(data) Object.assign(this, data);
  }
}
