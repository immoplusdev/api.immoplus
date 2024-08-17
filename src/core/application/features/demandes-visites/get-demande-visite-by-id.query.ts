import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";

export class GetDemandeVisiteByIdQuery {
  @ApiProperty({ format: "uuid" })
  bienImmobilierId: string;
  constructor(data?: OmitMethods<GetDemandeVisiteByIdQuery>) {
    if(data) Object.assign(this, data);
  }
}
