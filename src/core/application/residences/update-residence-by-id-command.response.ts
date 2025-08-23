import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ResidenceDto } from "@/infrastructure/features/residences";

export class UpdateResidenceByIdCommandResponse extends OmitType(
  ResidenceDto,
  [],
) {
  constructor(data?: OmitMethods<UpdateResidenceByIdCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseUpdateResidenceByIdCommandResponseDto extends WrapperResponseDto<UpdateResidenceByIdCommandResponse> {
  @ApiProperty({ type: UpdateResidenceByIdCommandResponse })
  data: UpdateResidenceByIdCommandResponse;

  constructor(data?: OmitMethods<UpdateResidenceByIdCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseUpdateResidenceByIdCommandResponseDtoMapper
  implements
    IMapper<
      UpdateResidenceByIdCommandResponse,
      WrapperResponseUpdateResidenceByIdCommandResponseDto
    >
{
  mapFrom(
    param: UpdateResidenceByIdCommandResponse,
  ): WrapperResponseUpdateResidenceByIdCommandResponseDto {
    return new WrapperResponseUpdateResidenceByIdCommandResponseDto(param);
  }

  mapTo(
    param: WrapperResponseUpdateResidenceByIdCommandResponseDto,
  ): UpdateResidenceByIdCommandResponse {
    return param.data;
  }
}
