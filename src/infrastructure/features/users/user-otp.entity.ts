import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OmitMethods } from "@/lib/ts-utilities";

@Entity("users_otps")
export class UserOtpEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "email", type: "varchar" })
  email: string;

  @Column({ name: "phone_number", type: "varchar" })
  phoneNumber: string;

  @Column({ name: "otp", type: "varchar", nullable: false })
  otp: string;

  @CreateDateColumn({ name: "otp_expiration" })
  otpExpiration?: Date;

  @Column({ name: "is_used", type: "bool", default: false })
  isUsed: boolean;

  @Column({ name: "token", type: "varchar", nullable: false })
  token?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  constructor(data?: OmitMethods<Partial<UserOtpEntity>>) {
    if (data) Object.assign(this, data);
  }
}
