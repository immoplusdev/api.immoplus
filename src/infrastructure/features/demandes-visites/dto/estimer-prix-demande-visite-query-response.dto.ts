import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { IsNotEmpty, IsNumber } from "class-validator";
import { ServiceDate, ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixDemandeVisiteQueryResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  bienImmobilier: string;
  @ApiProperty({ type: ServiceDate, isArray: true })
  datesDemandeVisite: ServiceDates;
  @ApiProperty()
  @IsNumber()
  montantTotalDemandeVisite: number;
  @ApiProperty()
  @IsNumber()
  montantDemandeVisiteSansCommission: number;
  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQueryResponseDto>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto extends WrapperResponseDto<EstimerPrixDemandeVisiteQueryResponseDto> {
   @ApiProperty({ type: EstimerPrixDemandeVisiteQueryResponseDto })
   data: EstimerPrixDemandeVisiteQueryResponseDto;
}