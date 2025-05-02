import { OmitMethods } from '@/lib/ts-utilities';
import { ServiceDates } from "@/core/domain/common/models";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsNotEmpty } from "class-validator";
import { ServiceDateDto } from "@/core/application/common/dto";

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
