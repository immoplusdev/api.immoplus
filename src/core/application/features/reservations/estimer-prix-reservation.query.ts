import { OmitMethods } from '@/lib/ts-utilities';
import { ServiceDates } from "@/core/domain/shared/models";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ServiceDateDto } from "@/infrastructure/shared/dto";

export class EstimerPrixReservationQuery {
  @ApiProperty()
  @IsNotEmpty()
  residence: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesReservation: ServiceDates;

  constructor(data?: OmitMethods<EstimerPrixReservationQuery>) {
    if(data) Object.assign(this, data);
  }
}
