import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";

export class UpdateReservationDto {
  @ApiProperty()
  notes: string;

  constructor(data?: OmitMethods<UpdateReservationDto>) {
    Object.assign(this, data);
  }
}