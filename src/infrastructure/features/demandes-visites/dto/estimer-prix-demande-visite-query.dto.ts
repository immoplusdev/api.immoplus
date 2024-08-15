import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";

export class EstimerPrixDemandeVisiteQueryDto {
  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQueryDto>) {
    if(data) Object.assign(this, data);
  }
}
