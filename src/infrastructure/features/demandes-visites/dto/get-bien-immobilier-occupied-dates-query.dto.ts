import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDates } from "@/core/domain/shared/models";
import { ServiceDateDto } from "@/infrastructure/shared/dto";

export class GetBienImmobilierOccupiedDatesQueryDto {
  @ApiProperty({ format: "uuid" })
  bienImmobilierId: string;

  constructor(data?: OmitMethods<GetBienImmobilierOccupiedDatesQueryDto>) {
    if (data) Object.assign(this, data);
  }
}
