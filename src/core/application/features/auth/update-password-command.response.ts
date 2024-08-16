import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordCommandResponse {
  constructor(data?: OmitMethods<UpdatePasswordCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseUpdatePasswordCommandResponseDto extends WrapperResponseDto<UpdatePasswordCommandResponse> {
  @ApiProperty({ type: UpdatePasswordCommandResponse })
  data: UpdatePasswordCommandResponse;
}

