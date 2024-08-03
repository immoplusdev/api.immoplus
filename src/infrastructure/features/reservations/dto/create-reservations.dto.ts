import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class CreateReservationDto {
constructor(data?: OmitMethods<CreateReservationDto>) {
  Object.assign(this, data);
  }
}