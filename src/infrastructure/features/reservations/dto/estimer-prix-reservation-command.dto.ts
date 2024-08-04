import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDates } from "@/core/domain/shared/models";
import { IsNotEmpty } from "class-validator";
import { ServiceDateDto } from "@/infrastructure/shared/models";

export class EstimerPrixReservationCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  residence: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesReservation: ServiceDates;

  constructor(data?: OmitMethods<EstimerPrixReservationCommandDto>) {
    Object.assign(this, data);
  }
}
