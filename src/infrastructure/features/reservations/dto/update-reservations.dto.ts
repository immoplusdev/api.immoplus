import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class UpdateReservationDto {
constructor(data?: OmitMethods<UpdateReservationDto>) {
  Object.assign(this, data);
  }
}