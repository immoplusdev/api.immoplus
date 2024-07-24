import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '@/core/application/features/auth/register.command';
import { RegisterCommandResponse } from '@/core/application/features/auth/register-command.response';
import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '@/core/domain/users';
import { UserEmailAlreadyTakenException } from '@/core/application/features/auth/user-email-already-taken.exception';
import {
  UserPhoneNumberAlreadyTakenException,
} from '@/core/application/features/auth/user-phone-number-already-taken.exception';
import { Deps } from '@/core/domain/shared/ioc';


@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand, RegisterCommandResponse> {
  constructor(@Inject(Deps.UsersRepository) private readonly usersRepository: IUsersRepository) {}

  async execute(command: RegisterCommand): Promise<RegisterCommandResponse> {
    await this.validateInput(command);

    const user = await this.usersRepository.create({
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: command.password,
      firstName: command.firstName,
      lastName: command.lastName,
      city: command.city,
    });
    return new RegisterCommandResponse({
      accessToken: "string",
      expires: "string",
      refreshToken: "string",
      user: user
    });
  }

  async validateInput(command: RegisterCommand) {
    await this.emailAvailable(command.email);
    await this.phoneNumberAvailable(command.phoneNumber);
  }

  async emailAvailable(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (user?.id) throw new UserEmailAlreadyTakenException();
  }

  async phoneNumberAvailable(phoneNumber: string) {
    const user = await this.usersRepository.findByPhoneNumber(phoneNumber);
    if (user?.id) throw new UserPhoneNumberAlreadyTakenException();
  }
}