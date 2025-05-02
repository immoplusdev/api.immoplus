import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";

export class RegisterProEntrepriseCommandResponse {
  constructor(data?: OmitMethods<RegisterProEntrepriseCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseRegisterProEntrepriseCommandResponseDto extends WrapperResponseDto<RegisterProEntrepriseCommandResponse> {
  @ApiProperty({ type: RegisterProEntrepriseCommandResponse })
  data: RegisterProEntrepriseCommandResponse;
}

