import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDemandeVisiteCommandResponse {
  constructor(data?: OmitMethods<CreateDemandeVisiteCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseCreateDemandeVisiteCommandResponseDto extends WrapperResponseDto<CreateDemandeVisiteCommandResponse> {
  @ApiProperty({ type: CreateDemandeVisiteCommandResponse })
  data: CreateDemandeVisiteCommandResponse;
}

