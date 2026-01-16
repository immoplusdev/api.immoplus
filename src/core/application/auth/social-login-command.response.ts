import { WrapperResponseDto } from "@/lib/responses";
import { LoginCommandResponse } from "./login-command.response";

export class SocialLoginCommandResponse extends LoginCommandResponse {}

export class WrapperResponseSocialLoginCommandResponseDto extends WrapperResponseDto<SocialLoginCommandResponse> {}
