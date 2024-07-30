import { Inject, Injectable } from "@nestjs/common";
import { ITfaService } from "@/core/domain/auth";
import { Deps } from "@/core/domain/shared/ioc";
import { IUsersRepository } from "@/core/domain/users";
import { generateRandomString } from "@/lib/ts-utilities/strings";


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
    const otp = this.generateOtp();
    await this.usersRepository.updateOne(userId, {
      otp,
    });
    return otp;
  }

  async generateUserPhoneNumberOtp(phoneNumber: string) {
    const user = await this.usersRepository.findByPhoneNumber(phoneNumber, ["id"]);
    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async generateUserEmailOtp(email: string) {
    const user = await this.usersRepository.findByEmail(email, ["id"]);
    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async verifyUserOtp(userId: string, otp: string) {
    const user = await this.usersRepository.findOne(userId, ["id", "otp"]);
    return user.otp === otp;
  }
}
