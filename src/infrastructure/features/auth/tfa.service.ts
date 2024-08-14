import { Inject, Injectable } from "@nestjs/common";
import { InvalidOtpException, ITfaService, VerifyOtpOptions } from "@/core/domain/auth";
import { Deps } from "@/core/domain/shared/ioc";
import { IUserRepository, UserNotFoundException } from "@/core/domain/users";
import { generateRandomString } from "@/lib/ts-utilities/strings";


@Injectable()
export class TfaService implements ITfaService {
  // TODO: Implement account blocking mechanism for multiple failed otp validation attempts
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
  ) {
  }

  generateOtp(): string {
    return generateRandomString(6, "number");
  }

  async generateUserOtp(userId: string) {
    try {
      const otp = this.generateOtp();
      await this.usersRepository.updateOne(userId, {
        otp,
        authLoginAttempts: 0,
      });
      return otp;
    } catch (err) {
      throw new UserNotFoundException();
    }
  }

  async generateUserPhoneNumberOtp(phoneNumber: string) {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber, { fields: ["id"] });
    if (!user) throw new UserNotFoundException();

    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async generateUserEmailOtp(email: string) {
    const user = await this.usersRepository.findOneByEmail(email, { fields: ["id"] });
    if (!user) throw new UserNotFoundException();

    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async verifyUserOtp(userId: string, otp: string, options?: VerifyOtpOptions) {
    const user = await this.usersRepository.findOne(userId, { fields: ["id", "otp"] });
    if (!user) throw new UserNotFoundException();

    const otpIsValid = user.otp === otp;

    if (!otpIsValid && options?.throwException) throw new InvalidOtpException();

    if (otpIsValid && options?.resetIfValid) await this.generateUserOtp(userId);

    return otpIsValid;
  }

  async verifyUserEmailOtp(email: string, otp: string, options?: VerifyOtpOptions) {
    const user = await this.usersRepository.findOneByEmail(email, { fields: ["id", "otp"] });
    if (!user) throw new UserNotFoundException();

    const otpIsValid = user.otp === otp;

    if (!otpIsValid && options?.throwException) throw new InvalidOtpException();

    if (otpIsValid && options?.resetIfValid) await this.generateUserOtp(user.id);

    return otpIsValid;
  }

  async verifyUserPhoneNumberOtp(phoneNumber: string, otp: string, options?: VerifyOtpOptions) {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber, { fields: ["id", "otp"] });
    if (!user) throw new UserNotFoundException();

    const otpIsValid = user.otp === otp;

    if (!otpIsValid && options?.throwException) throw new InvalidOtpException();

    if (otpIsValid && options?.resetIfValid) await this.generateUserOtp(user.id);

    return otpIsValid;
  }
}
