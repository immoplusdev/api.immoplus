import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";

export class GetResidenceOccupiedDatesQueryDto {
  @ApiProperty({ format: "uuid" })
  residenceId: string;
  constructor(data?: OmitMethods<GetResidenceOccupiedDatesQueryDto>) {
    Object.assign(this, data);
  }
}
