import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDate, ServiceDates } from "@/core/domain/shared/models";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class EstimerPrixDemandeVisiteQueryResponse {
  @ApiProperty({ format: "uuid" })
  bienImmobilier: string;
  @ApiProperty({ type: ServiceDate, isArray: true })
  datesDemandeVisite: ServiceDates;
  @ApiProperty()
  montantTotalDemandeVisite: number;
  @ApiProperty()
  montantDemandeVisiteSansCommission: number;

  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQueryResponse>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixDemandeVisiteQueryResponse extends WrapperResponseDto<EstimerPrixDemandeVisiteQueryResponse> {
  @ApiProperty({ type: EstimerPrixDemandeVisiteQueryResponse })
  data: EstimerPrixDemandeVisiteQueryResponse;
}
