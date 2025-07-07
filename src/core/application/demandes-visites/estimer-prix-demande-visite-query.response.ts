import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";
import { WrapperResponseDto } from "@/lib/responses";
import { IsNotEmpty, IsNumber } from "class-validator";
import { ServiceDates } from "@/core/domain/common/models";
import { ServiceDateDto } from "@/core/application/common/dto";

export class EstimerPrixDemandeVisiteQueryResponse {
  @ApiProperty()
  @IsNotEmpty()
  bienImmobilier: string;
  @ApiProperty()
  @IsNumber()
  montantTotalDemandeVisite: number;
  @ApiProperty()
  @IsNumber()
  montantCommission: number;
  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQueryResponse>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto extends WrapperResponseDto<EstimerPrixDemandeVisiteQueryResponse> {
  @ApiProperty({ type: EstimerPrixDemandeVisiteQueryResponse })
  data: EstimerPrixDemandeVisiteQueryResponse;
}
