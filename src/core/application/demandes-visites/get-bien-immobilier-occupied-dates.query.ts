import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";

export class GetBienImmobilierOccupiedDatesQuery {
  @ApiProperty({ format: "uuid" })
  bienImmobilierId: string;
  constructor(data?: OmitMethods<GetBienImmobilierOccupiedDatesQuery>) {
    if(data) Object.assign(this, data);
  }
}
