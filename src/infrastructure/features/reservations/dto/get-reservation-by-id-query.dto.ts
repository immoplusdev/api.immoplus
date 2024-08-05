import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetReservationByIdQueryDto {
  @ApiProperty({ format: "uuid"})
  @IsNotEmpty()
  id: string;
  constructor(data?: OmitMethods<GetReservationByIdQueryDto>) {
    Object.assign(this, data);
  }
}
