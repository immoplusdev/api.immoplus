import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";
import { IsNotEmpty } from "class-validator";

export class GetReservationByIdQuery {
  @ApiProperty({ format: "uuid"})
  @IsNotEmpty()
  id: string;
  constructor(data?: OmitMethods<GetReservationByIdQuery>) {
    if(data) Object.assign(this, data);
  }
}
