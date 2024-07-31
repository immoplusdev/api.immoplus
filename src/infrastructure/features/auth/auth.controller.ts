import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  RegisterCommandDto,
  RegisterProEntrepriseCommandDto,
  RegisterProParticulierCommandDto, ResetPasswordCommandDto, SendEmailOtpCommandDto, SendSmsOtpCommandDto,
  UpdatePasswordCommandDto, VerifyEmailCommandDto, VerifyPhoneNumberCommandDto,
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
  RegisterProParticulierCommand, ResetPasswordCommand,
  SendEmailOtpCommand,
  SendSmsOtpCommand,
  UpdatePasswordCommand,
  VerifyEmailCommand,
  VerifyPhoneNumberCommand,
} from "@/core/application/features/auth";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { I18nService } from "nestjs-i18n";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    readonly commandBus: CommandBus,
    private readonly i18n: I18nService,
  ) {
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
    const command = new UpdatePasswordCommand({ ...payload, userId });
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @Post("send-sms-otp")
  async sendSmsOtp(@Body() payload: SendSmsOtpCommandDto) {
    const command = new SendSmsOtpCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @Post("send-email-otp")
  async sendEmailOtp(@Body() payload: SendEmailOtpCommandDto) {
    const command = new SendEmailOtpCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @Post("verify-email")
  async verifyEmail(@Body() payload: VerifyEmailCommandDto) {
    const command = new VerifyEmailCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @Post("verify-phone-number")
  async verifyPhoneNumber(@Body() payload: VerifyPhoneNumberCommandDto) {
    const command = new VerifyPhoneNumberCommand(payload);
    await this.commandBus.execute(command);
  }

  @ApiNoContentResponse()
  @Post("reset-password")
  async resetPassword(@Body() payload: ResetPasswordCommandDto) {
    const command = new ResetPasswordCommand(payload);
    await this.commandBus.execute(command);
  }
}
