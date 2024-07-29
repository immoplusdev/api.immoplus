import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterProEntrepriseCommandResponseDto {
  constructor(data?: OmitMethods<RegisterProEntrepriseCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseRegisterProEntrepriseCommandResponseDto extends WrapperResponseDto<RegisterProEntrepriseCommandResponseDto> {
   @ApiProperty({ type: RegisterProEntrepriseCommandResponseDto })
   data: RegisterProEntrepriseCommandResponseDto;
}

