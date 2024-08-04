import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ServiceDateDto } from "@/infrastructure/shared/models";
import { ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixReservationQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  residence: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesReservation: ServiceDates;
  constructor(data?: OmitMethods<EstimerPrixReservationQueryDto>) {
    Object.assign(this, data);
  }
}
