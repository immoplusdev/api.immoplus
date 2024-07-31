import { Inject, Injectable } from "@nestjs/common";
import { ITfaService } from "@/core/domain/auth";
import { Deps } from "@/core/domain/shared/ioc";
import { IUsersRepository } from "@/core/domain/users";
import { generateRandomString } from "@/lib/ts-utilities/strings";
import { UserNotFoundException } from "@/core/domain/shared/exceptions";


@Injectable()
export class TfaService implements ITfaService {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUsersRepository,
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
      });
      return otp;
    } catch (err) {
      console.log(err)
      throw new UserNotFoundException();
    }
  }

  async generateUserPhoneNumberOtp(phoneNumber: string) {
    const user = await this.usersRepository.findByPhoneNumber(phoneNumber, ["id"]);
    if (!user) throw new UserNotFoundException();

    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async generateUserEmailOtp(email: string) {
    const user = await this.usersRepository.findByEmail(email, ["id"]);
    if (!user) throw new UserNotFoundException();

    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async verifyUserOtp(userId: string, otp: string, resetIfValid?: boolean) {
    const user = await this.usersRepository.findOne(userId, ["id", "otp"]);
    if (!user) throw new UserNotFoundException();

    const otpIsValid = user.otp === otp;

    if (otpIsValid && resetIfValid) await this.generateUserOtp(userId);

    return otpIsValid;
  }
}
