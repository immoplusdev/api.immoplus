import { DemandeVisiteDetailsDto } from "./demande-visite-details.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";

export class CreateDemandeVisiteCommandResponse extends OmitType(
  DemandeVisiteDetailsDto,
  [] as const,
) {
  constructor(data?: OmitMethods<CreateDemandeVisiteCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseCreateDemandeVisiteResponseDto extends WrapperResponseDto<CreateDemandeVisiteCommandResponse> {
  @ApiProperty({ type: CreateDemandeVisiteCommandResponse })
  data: CreateDemandeVisiteCommandResponse;
}

export class WrapperResponseCreateDemandeVisiteCommandResponseDtoMapper implements IMapper<
  CreateDemandeVisiteCommandResponse,
  WrapperResponseCreateDemandeVisiteResponseDto
> {
  mapFrom(
    param: CreateDemandeVisiteCommandResponse,
  ): WrapperResponseCreateDemandeVisiteResponseDto {
    return new WrapperResponseCreateDemandeVisiteResponseDto(param);
  }

  mapTo(
    param: WrapperResponseCreateDemandeVisiteResponseDto,
  ): CreateDemandeVisiteCommandResponse {
    return param.data;
  }
}
