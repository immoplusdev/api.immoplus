import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDates } from "@/core/domain/shared/models";
import { ServiceDateDto } from "@/infrastructure/shared/models";
import { IsNotEmpty, IsNumber } from "class-validator";

export class EstimerPrixReservationCommandResponseDto {
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

  constructor(data?: OmitMethods<EstimerPrixReservationCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixReservationCommandResponseDto extends WrapperResponseDto<EstimerPrixReservationCommandResponseDto> {
  @ApiProperty({ type: EstimerPrixReservationCommandResponseDto })
  data: EstimerPrixReservationCommandResponseDto;
}

