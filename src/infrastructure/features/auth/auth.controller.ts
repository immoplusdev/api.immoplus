import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  LoginWithPhoneNumberCommandDto, LoginWithPhoneNumberCommandResponseDto,
  RegisterCommandDto, RegisterCommandDtoMapper,
  RegisterCommandResponseDto, WrapperResponseLoginWithPhoneNumberCommandResponseDto,
  WrapperResponseRegisterCommandResponseDto,
} from "@/infrastructure/features/auth/dtos";
import { CommandBus } from "@nestjs/cqrs";
import { AutoMapper } from "@/lib/ts-utilities";
import { LoginWithPhoneNumberCommand } from "@/core/application/features/auth/login-with-phone-number.command";
import { LoginCommand } from "@/core/application/features/auth/login.command";
import {
  LoginCommandResponseDto,
  WrapperResponseLoginCommandResponseDto,
} from "@/infrastructure/features/auth/dtos/login-command-response.dto";
import { LoginCommandDto } from "@/infrastructure/features/auth/dtos/login-command.dto";
import { RegisterCommand } from "@/core/application/features/auth";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(readonly commandBus: CommandBus) {
  }

  @ApiResponse({
    type: WrapperResponseRegisterCommandResponseDto,
  })
  @Post("register-customer")
  async registerCustomer(@Body() payload: RegisterCommandDto) {
    const responseMapper = new WrapperResponseDtoMapper<RegisterCommandResponseDto>();
    const command = new RegisterCommand(payload);

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }


  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @Post("login")
  async login(@Body() payload: LoginCommandDto) {
    const responseMapper = new WrapperResponseDtoMapper<LoginCommandResponseDto>();
    const command = new LoginCommand(payload);

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }


  @ApiResponse({
    type: WrapperResponseLoginWithPhoneNumberCommandResponseDto,
  })
  @Post("login-with-phone-number")
  async loginWithPhoneNumber(@Body() payload: LoginWithPhoneNumberCommandDto) {
    const responseMapper = new WrapperResponseDtoMapper<LoginWithPhoneNumberCommandResponseDto>();
    const command = new LoginWithPhoneNumberCommand(payload);

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }
}
