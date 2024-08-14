import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class UpdateBienImmobilierDto {
constructor(data?: OmitMethods<UpdateBienImmobilierDto>) {
  if(data) Object.assign(this, data);
  }
}