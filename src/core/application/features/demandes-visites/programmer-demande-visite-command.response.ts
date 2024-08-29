import { IMapper, OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DemandeVisiteDetailsDto } from "@/core/application/features/demandes-visites/demande-visite-details.dto";

export class ProgrammerDemandeVisiteCommandResponse extends OmitType(DemandeVisiteDetailsDto, [] as const) {
  constructor(data?: OmitMethods<ProgrammerDemandeVisiteCommandResponse>) {
    if(data) super(data);
  }
}

  export class WrapperResponseProgrammerDemandeVisiteCommandResponseDto extends WrapperResponseDto<ProgrammerDemandeVisiteCommandResponse> {
    @ApiProperty({ type: ProgrammerDemandeVisiteCommandResponse })
    data: ProgrammerDemandeVisiteCommandResponse;
    constructor(data?: OmitMethods<ProgrammerDemandeVisiteCommandResponse>) {
      if (data) super(data);
    }
  }
      
  export class WrapperResponseProgrammerDemandeVisiteCommandResponseDtoMapper implements IMapper<ProgrammerDemandeVisiteCommandResponse, WrapperResponseProgrammerDemandeVisiteCommandResponseDto> {
      mapFrom(param: ProgrammerDemandeVisiteCommandResponse): WrapperResponseProgrammerDemandeVisiteCommandResponseDto {
         return new WrapperResponseProgrammerDemandeVisiteCommandResponseDto(param);
      }

      mapTo(param: WrapperResponseProgrammerDemandeVisiteCommandResponseDto): ProgrammerDemandeVisiteCommandResponse {
         return param.data;
      }
  }
      