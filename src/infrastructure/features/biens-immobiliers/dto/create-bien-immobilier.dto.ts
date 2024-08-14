import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class CreateBienImmobilierDto {

constructor(data?: OmitMethods<CreateBienImmobilierDto>) {
  if(data) Object.assign(this, data);
  }
}