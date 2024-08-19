import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { IsNotEmpty, IsNumber } from "class-validator";
import { ServiceDateDto } from "@/core/application/shared/dto";
import { ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixReservationQueryResponse {
  @ApiProperty()
  @IsNotEmpty()
  residence: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesReservation: ServiceDates;
  @ApiProperty()
  @IsNumber()
  montantTotalReservation: number;
  @ApiProperty()
  @IsNumber()
  montantReservationSansCommission: number;
  constructor(data?: OmitMethods<EstimerPrixReservationQueryResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixReservationQueryResponseDto extends WrapperResponseDto<EstimerPrixReservationQueryResponse> {
  @ApiProperty({ type: EstimerPrixReservationQueryResponse })
  data: EstimerPrixReservationQueryResponse;
}