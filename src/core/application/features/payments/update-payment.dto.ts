import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class UpdatePaymentDto {
constructor(data?: OmitMethods<UpdatePaymentDto>) {
  if(data) Object.assign(this, data);
  }
}