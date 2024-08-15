import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class UpdateDemandeVisiteDto {
constructor(data?: OmitMethods<UpdateDemandeVisiteDto>) {
  if(data) Object.assign(this, data);
  }
}