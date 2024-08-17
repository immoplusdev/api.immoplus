import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { IsNotEmpty, IsNumber } from "class-validator";
import { ServiceDates } from "@/core/domain/shared/models";
import { ServiceDateDto } from "@/infrastructure/shared/dto";

export class EstimerPrixDemandeVisiteQueryResponse {
  @ApiProperty()
  @IsNotEmpty()
  bienImmobilier: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesDemandeVisite: ServiceDates;
  @ApiProperty()
  @IsNumber()
  montantTotalDemandeVisite: number;
  @ApiProperty()
  @IsNumber()
  montantDemandeVisiteSansCommission: number;
  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQueryResponse>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto extends WrapperResponseDto<EstimerPrixDemandeVisiteQueryResponse> {
  @ApiProperty({ type: EstimerPrixDemandeVisiteQueryResponse })
  data: EstimerPrixDemandeVisiteQueryResponse;
}