import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { DemandeVisiteDetailsDto } from "./demande-visite-details.dto";

export class GetDemandeVisiteByIdQueryResponse extends OmitType(DemandeVisiteDetailsDto, [] as const){
  constructor(data?: OmitMethods<GetDemandeVisiteByIdQueryResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseGetDemandeVisiteByIdQueryResponseDto extends WrapperResponseDto<GetDemandeVisiteByIdQueryResponse> {
  @ApiProperty({ type: GetDemandeVisiteByIdQueryResponse })
  data: GetDemandeVisiteByIdQueryResponse;
}