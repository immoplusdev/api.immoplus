import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class CreateDemandeVisiteDto {
constructor(data?: OmitMethods<CreateDemandeVisiteDto>) {
  if(data) Object.assign(this, data);
  }
}