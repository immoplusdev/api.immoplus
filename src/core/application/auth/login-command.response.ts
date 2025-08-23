import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";
import { UserDto, UserDtoMapper } from "@/core/application/users";

export class LoginCommandResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;

  constructor(data?: OmitMethods<LoginCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseLoginCommandResponseDto extends WrapperResponseDto<LoginCommandResponse> {
  @ApiProperty({ type: LoginCommandResponse })
  data: LoginCommandResponse;

  constructor(data?: OmitMethods<LoginCommandResponse>) {
    if (data) super(data);
  }
}

export class WrapperResponseLoginCommandResponseDtoMapper
  implements
    IMapper<LoginCommandResponse, WrapperResponseLoginCommandResponseDto>
{
  mapFrom(param: LoginCommandResponse): WrapperResponseLoginCommandResponseDto {
    param.user = new UserDtoMapper().mapFrom(param.user);
    return new WrapperResponseLoginCommandResponseDto(param);
  }

  mapTo(param: WrapperResponseLoginCommandResponseDto): LoginCommandResponse {
    return param.data;
  }
}
