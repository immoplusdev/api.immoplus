import { DocProperty, OmitMethods } from "@/lib/ts-utilities";
import { ServiceDate, ServiceDates } from "@/core/domain/shared/models";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { EstimerPrixDemandeVisiteQueryResponseDto } from "@/infrastructure/features/demandes-visites";

export class EstimerPrixDemandeVisiteQueryResponse {
  @DocProperty({ format: "uuid" })
  bienImmobilier: string;
  @DocProperty({ type: ServiceDate, isArray: true })
  datesDemandeVisite: ServiceDates;
  @DocProperty()
  montantTotalDemandeVisite: number;
  @DocProperty()
  montantDemandeVisiteSansCommission: number;

  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQueryResponse>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseEstimerPrixDemandeVisiteQueryResponse extends WrapperResponseDto<EstimerPrixDemandeVisiteQueryResponse> {
  @ApiProperty({ type: EstimerPrixDemandeVisiteQueryResponse })
  data: EstimerPrixDemandeVisiteQueryResponse;
}
