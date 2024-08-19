import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DemandeVisiteDetailsDto } from "./demande-visite-details.dto";

export class AnnulerDemandeVisiteByIdCommandResponse extends OmitType(DemandeVisiteDetailsDto, ["deletedAt"] as const) {
  constructor(data?: OmitMethods<AnnulerDemandeVisiteByIdCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseAnnulerDemandeVisiteByIdCommandResponseDto extends WrapperResponseDto<AnnulerDemandeVisiteByIdCommandResponse> {
  @ApiProperty({ type: AnnulerDemandeVisiteByIdCommandResponse })
  data: AnnulerDemandeVisiteByIdCommandResponse;

  constructor(data?: OmitMethods<AnnulerDemandeVisiteByIdCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseAnnulerDemandeVisiteCommandResponseDtoMapper implements IMapper<AnnulerDemandeVisiteByIdCommandResponse, WrapperResponseAnnulerDemandeVisiteByIdCommandResponseDto> {
  mapFrom(param: AnnulerDemandeVisiteByIdCommandResponse): WrapperResponseAnnulerDemandeVisiteByIdCommandResponseDto {
    return new WrapperResponseAnnulerDemandeVisiteByIdCommandResponseDto(param);
  }

  mapTo(param: WrapperResponseAnnulerDemandeVisiteByIdCommandResponseDto): AnnulerDemandeVisiteByIdCommandResponse {
    return param.data;
  }
}
      