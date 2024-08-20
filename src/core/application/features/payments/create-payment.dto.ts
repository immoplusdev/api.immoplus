import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class CreatePaymentDto {
constructor(data?: OmitMethods<CreatePaymentDto>) {
  if(data) Object.assign(this, data);
  }
}