import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserData, UserStatus } from "@/core/domain/users";
import { RoleEntity } from "@/infrastructure/features/roles";
import { UserDataEntity } from "@/infrastructure/features/users/users-data.entity";
import { Role } from "@/core/domain/roles";
import { FileEntity } from "@/infrastructure/features/files";

@Entity("users")
export class UserEntity {
  // basic fields
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "first_name", type: "varchar" })
  firstName: string;
  @Column({ name: "last_name", type: "varchar" })
  lastName: string;
  @Column({ name: "email", type: "varchar" })
  email: string;
  @Column({ name: "password", type: "varchar" })
  password: string;
  @Column({ name: "role", type: "uuid" })
  @ManyToOne(() => RoleEntity, (role) => role.id)
  @JoinColumn({ name: "role_id" })
  role: Role | string;
  @Column({ name: "language", type: "varchar", nullable: true })
  language?: string;
  @Column({ name: "avatar", type: "uuid", nullable: true })
  @ManyToOne(() => FileEntity, (file) => file.id)
  avatar?: File | string;
  @Column({ name: "phone_number", type: "varchar" })
  phoneNumber: string;
  @Column({ name: "otp", type: "varchar", nullable: true })
  otp?: string;
  @CreateDateColumn({ name: "otp_expiration" })
  otpExpiration?: Date;

  // User Data
  @Column({ name: "country", type: "varchar", nullable: true })
  country?: string;
  @Column({ name: "state", type: "varchar", nullable: true })
  state?: string;
  @Column({ name: "city", type: "varchar", nullable: true })
  city?: string;
  @Column({ name: "commune", type: "varchar", nullable: true })
  commune?: string;
  @Column({ name: "address", type: "varchar", nullable: true })
  address?: string;
  @Column({ name: "address_2", type: "varchar", nullable: true })
  address2?: string;
  @Column({ name: "currency", type: "varchar", nullable: true })
  currency?: string;

  @Column({ name: "additional_data", type: "uuid" })
  @OneToOne(() => UserDataEntity, (userData) => userData.user)
  @JoinColumn({ name: "additional_data_id" })
  additionalData?: UserData | string;

  // Status and Dates
  @Column({ name: "email_verified", type: "bool", default: false })
  emailVerified: boolean;
  @Column({ name: "phone_number_verified", type: "bool", default: false })
  phoneNumberVerified: boolean;
  @Column({ name: "auth_login_attempts", type: "int", default: 0 })
  authLoginAttempts: number;
  @Column({
    name: "status",
    type: "varchar",
    nullable: false,
    default: UserStatus.Active,
  })
  status: UserStatus;
  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
