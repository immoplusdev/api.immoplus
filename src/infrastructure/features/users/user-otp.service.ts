import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { UserOtpRepository } from "./user-otp.repository";
import { UserOtpEntity } from "./user-otp.entity";
import {
  IMailService,
  IEmailTemplateService,
  EmailTemplate,
} from "@/core/domain/notifications";
import { Deps } from "@/core/domain/common/ioc";
import * as crypto from "crypto";
import { UnauthorizedException } from "@/core/domain/auth";

@Injectable()
export class UserOtpService {
  constructor(
    private readonly userOtpRepository: UserOtpRepository,
    @Inject(Deps.MailService)
    private readonly mailService: IMailService,
    @Inject(Deps.EmailTemplateService)
    private readonly emailTemplateService: IEmailTemplateService,
  ) {}

  async sendOtp(email: string): Promise<string> {
    const existingOtp = await this.userOtpRepository.findOneByEmail(email);
    console.log("existingOtp: ", existingOtp);

    const otp = this.generateOtp();
    const token = this.generateToken();
    const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if (existingOtp) {
      // Mettre à jour l'OTP existant
      await this.userOtpRepository.updateOne(existingOtp.id, {
        otp,
        token,
        otpExpiration,
        isUsed: false,
      });
      await this.userOtpRepository.findOneByEmail(email);
    } else {
      // Créer un nouveau OTP
      const userOtp = new UserOtpEntity({
        email,
        phoneNumber: "", // Optionnel pour l'instant
        otp,
        token,
        otpExpiration,
        isUsed: false,
      });
      await this.userOtpRepository.createOne(userOtp);
    }

    const otpDigits = otp.split("");
    const html = await this.emailTemplateService.render(EmailTemplate.OTP, {
      prenom: "Utilisateur",
      otpDigit1: otpDigits[0] || "",
      otpDigit2: otpDigits[1] || "",
      otpDigit3: otpDigits[2] || "",
      otpDigit4: otpDigits[3] || "",
      otpDigit5: otpDigits[4] || "",
      otpDigit6: otpDigits[5] || "",
      lien: "https://immoplus.ci",
      unsubscribe_link: "https://immoplus.ci/unsubscribe",
    });

    await this.mailService.sendMail({
      to: email,
      subject: "Code de vérification - ImmoPlus",
      html,
    });

    return "Code de vérification envoyé par email avec succès";
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; token?: string; email?: string }> {
    try {
      const userOtp = await this.userOtpRepository.findValidOtpByEmailAndOtp(
        email,
        otp,
      );

      if (!userOtp) {
        throw new BadRequestException("Code de vérification invalide");
      }

      if (userOtp.isUsed) {
        throw new BadRequestException("Ce code a déjà été utilisé");
      }

      if (new Date() > userOtp.otpExpiration) {
        throw new BadRequestException("Le code a expiré");
      }

      await this.userOtpRepository.updateOne(userOtp.id, { isUsed: true });

      return {
        success: true,
        token: userOtp.token,
        email: userOtp.email,
      };
    } catch (error) {
      throw new UnauthorizedException({ message: error.message });
    }
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.userOtpRepository.deleteExpiredOtps();
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}
