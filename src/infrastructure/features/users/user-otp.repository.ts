import { Injectable, Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import { UserOtpEntity } from "./user-otp.entity";
import { Deps } from "@/core/domain/common/ioc";
import { BaseRepository } from "@/infrastructure/typeorm";

@Injectable()
export class UserOtpRepository {
  private readonly repository: BaseRepository<UserOtpEntity>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, UserOtpEntity, []);
  }

  async createOne(payload: Partial<UserOtpEntity>): Promise<UserOtpEntity> {
    return await this.repository.createOne(payload);
  }

  async findOneByEmail(email: string): Promise<UserOtpEntity | null> {
    return await this.repository.findOneByQuery({
      _where: [{ _field: "email", _val: email }],
    });
  }

  async findOneByToken(token: string): Promise<UserOtpEntity | null> {
    return await this.repository.findOneByQuery({
      _where: [{ _field: "token", _val: token }],
    });
  }

  async findValidOtpByEmail(email: string): Promise<UserOtpEntity | null> {
    return await this.repository.findOneByQuery({
      _where: [
        { _field: "email", _val: email },
        { _field: "isUsed", _val: false },
      ],
    });
  }

  async findValidOtpByEmailAndOtp(
    email: string,
    otp: string,
  ): Promise<UserOtpEntity | null> {
    return await this.repository.findOneByQuery({
      _where: [
        { _field: "email", _val: email },
        { _field: "otp", _val: otp },
      ],
    });
  }

  async updateOne(
    id: string,
    payload: Partial<UserOtpEntity>,
  ): Promise<string> {
    await this.repository.updateOne(id, payload);
    return id;
  }

  async deleteExpiredOtps(): Promise<void> {
    await this.repository.deleteByQuery({
      _where: [
        {
          _field: "otpExpiration",
          _op: "lt",
          _val: new Date(),
        },
      ],
    });
  }
}