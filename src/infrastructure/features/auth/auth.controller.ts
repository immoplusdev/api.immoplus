import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  RegisterCommandDto,
  RegisterProEntrepriseCommandDto,
  RegisterProParticulierCommandDto,
  UpdatePasswordCommandDto,
} from "src/infrastructure/features/auth/dto";
import { CommandBus } from "@nestjs/cqrs";
import { LoginCommand } from "@/core/application/features/auth/login.command";
import {
  LoginCommandResponseDto,
  WrapperResponseLoginCommandResponseDto,
} from "@/infrastructure/features/auth/dto/login-command-response.dto";
import { LoginCommandDto } from "@/infrastructure/features/auth/dto/login-command.dto";
import {
  RegisterCommand,
  RegisterProEntrepriseCommand,
  RegisterProParticulierCommand, UpdatePasswordCommand,
} from "@/core/application/features/auth";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(readonly commandBus: CommandBus) {
  }

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @Post("register-customer")
  async registerCustomer(@Body() payload: RegisterCommandDto) {
    const responseMapper = new WrapperResponseDtoMapper<LoginCommandResponseDto>();
    const registerCommand = new RegisterCommand(payload);
    const loginCommand = new LoginCommand({
      username: registerCommand.phoneNumber,
      password: registerCommand.password,
    });

    await this.commandBus.execute(registerCommand);
    const response = await this.commandBus.execute(loginCommand);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @Post("register-pro-particulier")
  async registerProParticulier(@Body() payload: RegisterProParticulierCommandDto) {
    const responseMapper = new WrapperResponseDtoMapper<LoginCommandResponseDto>();
    const registerCommand = new RegisterProParticulierCommand(payload);
    const loginCommand = new LoginCommand({
      username: registerCommand.phoneNumber,
      password: registerCommand.password,
    });

    await this.commandBus.execute(registerCommand);
    const response = await this.commandBus.execute(loginCommand);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @Post("register-pro-entreprise")
  async registerProEntreprise(@Body() payload: RegisterProEntrepriseCommandDto) {
    const responseMapper = new WrapperResponseDtoMapper<LoginCommandResponseDto>();
    const registerCommand = new RegisterProEntrepriseCommand(payload);
    const loginCommand = new LoginCommand({
      username: registerCommand.phoneNumber,
      password: registerCommand.password,
    });

    await this.commandBus.execute(registerCommand);
    const response = await this.commandBus.execute(loginCommand);
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

  @ApiNoContentResponse()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("update-password")
  async updatePassword(
    @Body() payload: UpdatePasswordCommandDto,
    @CurrentUser("id") userId: string) {
    const responseMapper = new WrapperResponseDtoMapper<UpdatePasswordCommandDto>();
    const command = new UpdatePasswordCommand({ ...payload, userId });

    await this.commandBus.execute(command);
  }


  // @ApiResponse({
  //   type: WrapperResponseLoginWithPhoneNumberCommandResponseDto,
  // })
  // @Post("login-with-phone-number")
  // async loginWithPhoneNumber(@Body() payload: LoginWithPhoneNumberCommandDto) {
  //   const responseMapper = new WrapperResponseDtoMapper<LoginWithPhoneNumberCommandResponseDto>();
  //   const command = new LoginWithPhoneNumberCommand(payload);
  //
  //   const response = await this.commandBus.execute(command);
  //   return responseMapper.mapFrom(response);
  // }
}
