import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { CommandBus } from "@nestjs/cqrs";
import { LoginCommand } from "@/core/application/auth/login.command";
import {
  LoginWithEmailOtpCommand,
  LoginWithEmailOtpCommandResponse,
  LoginWithPhoneNumberOtpCommand,
  LoginWithPhoneNumberOtpCommandResponse,
  RefreshTokenCommand,
  RefreshTokenCommandResponse,
  RegisterCommand,
  RegisterProEntrepriseCommand,
  RegisterProParticulierCommand,
  ResetPasswordCommand,
  SendEmailOtpCommand,
  SendSmsOtpCommand,
  UpdatePasswordCommand,
  VerifyEmailCommand,
  VerifyPhoneNumberCommand,
  WrapperResponseLoginCommandResponseDto,
  WrapperResponseLoginCommandResponseDtoMapper,
  WrapperResponseLoginWithPhoneNumberOtpCommandResponseDto,
} from "@/core/application/auth";
import { RefreshTokenDto } from "./dto";
import {
  CurrentUser,
  RequiredPermissions,
  RequiredRoles,
} from "@/infrastructure/decorators";
import { UserApp, UserRole } from "@/core/domain/roles";
import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/features/auth/guards";
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(readonly commandBus: CommandBus) {}

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @HttpCode(200)
  @Post("register-customer")
  async registerCustomer(@Body() payload: RegisterCommand) {
    const responseMapper = new WrapperResponseLoginCommandResponseDtoMapper();
    const loginCommand = new LoginCommand({
      username: payload.phoneNumber,
      password: payload.password,
      source: UserApp.CustomerApp,
    });

    await this.commandBus.execute(new RegisterCommand(payload));
    const response = await this.commandBus.execute(loginCommand);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @HttpCode(200)
  @Post("register-pro-particulier")
  async registerProParticulier(@Body() payload: RegisterProParticulierCommand) {
    const responseMapper = new WrapperResponseLoginCommandResponseDtoMapper();
    const registerCommand = new RegisterProParticulierCommand(payload);
    const loginCommand = new LoginCommand({
      username: registerCommand.phoneNumber,
      password: registerCommand.password,
      source: UserApp.ProApp,
    });

    await this.commandBus.execute(registerCommand);
    const response = await this.commandBus.execute(loginCommand);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @HttpCode(200)
  @Post("register-pro-entreprise")
  async registerProEntreprise(@Body() payload: RegisterProEntrepriseCommand) {
    const responseMapper = new WrapperResponseLoginCommandResponseDtoMapper();
    const registerCommand = new RegisterProEntrepriseCommand(payload);
    const loginCommand = new LoginCommand({
      username: registerCommand.phoneNumber,
      password: registerCommand.password,
      source: UserApp.ProApp,
    });

    await this.commandBus.execute(registerCommand);
    const response = await this.commandBus.execute(loginCommand);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @HttpCode(200)
  @Post("login")
  async login(@Body() payload: LoginCommand) {
    const responseMapper = new WrapperResponseLoginCommandResponseDtoMapper();

    const response = await this.commandBus.execute(new LoginCommand(payload));
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseLoginWithPhoneNumberOtpCommandResponseDto,
  })
  @HttpCode(200)
  @Post("login-with-phone-number-otp")
  async loginWithPhoneNumberOtp(
    @Body() payload: LoginWithPhoneNumberOtpCommand,
  ) {
    const responseMapper =
      new WrapperResponseDtoMapper<LoginWithPhoneNumberOtpCommandResponse>();
    const command = new LoginWithPhoneNumberOtpCommand(payload);

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseLoginWithPhoneNumberOtpCommandResponseDto,
  })
  @HttpCode(200)
  @Post("login-with-email-otp")
  async loginWithEmailOtp(@Body() payload: LoginWithEmailOtpCommand) {
    const responseMapper =
      new WrapperResponseDtoMapper<LoginWithEmailOtpCommandResponse>();

    const response = await this.commandBus.execute(
      new LoginWithEmailOtpCommand(payload),
    );
    return responseMapper.mapFrom(response);
  }

  @ApiNoContentResponse()
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @Post("update-password")
  async updatePassword(
    @Body() payload: UpdatePasswordCommand,
    @CurrentUser("id") userId: string,
  ) {
    const command = new UpdatePasswordCommand({ ...payload, userId });
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @HttpCode(204)
  @Post("send-sms-otp")
  async sendSmsOtp(@Body() payload: SendSmsOtpCommand) {
    const command = new SendSmsOtpCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @HttpCode(204)
  @Post("send-email-otp")
  async sendEmailOtp(@Body() payload: SendEmailOtpCommand) {
    const command = new SendEmailOtpCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @HttpCode(204)
  @Post("verify-email")
  async verifyEmail(@Body() payload: VerifyEmailCommand) {
    const command = new VerifyEmailCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @HttpCode(204)
  @Post("verify-phone-number")
  async verifyPhoneNumber(@Body() payload: VerifyPhoneNumberCommand) {
    const command = new VerifyPhoneNumberCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @HttpCode(204)
  @Post("reset-password")
  async resetPassword(@Body() payload: ResetPasswordCommand) {
    const command = new ResetPasswordCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiResponse({
    type: WrapperResponseLoginCommandResponseDto,
  })
  @HttpCode(200)
  @Post("refresh-token")
  async refreshToken(@Body() payload: RefreshTokenDto) {
    const responseMapper =
      new WrapperResponseDtoMapper<RefreshTokenCommandResponse>();
    const command = new RefreshTokenCommand(payload.refreshToken);

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }
}
