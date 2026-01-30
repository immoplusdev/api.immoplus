import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OmitMethods } from "@/lib/ts-utilities";
import { Role } from "@/core/domain/roles";
import { UserStatus } from "@/core/domain/users";
import { RoleEntity } from "@/infrastructure/features/roles";
import { UserDataEntity } from "./user-data.entity";
import { WalletEntity } from "../wallets/wallet.entity";
import { FileEntity } from "@/infrastructure/features/files";

@Entity("users")
export class UserEntity {
  // basic fields
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "first_name", type: "varchar", nullable: true })
  firstName: string;
  @Column({ name: "last_name", type: "varchar", nullable: true })
  lastName: string;
  @Column({ name: "email", type: "varchar", unique: true })
  email: string;
  @Column({ name: "password", type: "varchar", nullable: true })
  password?: string;

  // Social auth data
  @Column({
    name: "google_id",
    type: "text",
    nullable: true,
  })
  googleId?: string;
  @Column({
    name: "facebook_id",
    type: "text",
    nullable: true,
  })
  facebookId?: string;

  @ManyToOne(() => RoleEntity, (role) => role.id)
  @JoinColumn({ name: "role_id" })
  role: Role | string;
  @Column({ name: "language", type: "varchar", nullable: true })
  language?: string;
  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  @JoinColumn({ name: "avatar_id" })
  avatar?: string;
  @Column({ name: "phone_number", type: "varchar", unique: true })
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

  @OneToOne(() => UserDataEntity, (userData) => userData.user)
  @JoinColumn({ name: "additional_data_id" })
  additionalData?: UserDataEntity | string;

  // Status and Dates
  @Column({ name: "identity_verified", type: "bool", default: false })
  identityVerified: boolean;
  @Column({ name: "email_verified", type: "bool", default: false })
  emailVerified: boolean;
  @Column({ name: "phone_number_verified", type: "bool", default: false })
  phoneNumberVerified: boolean;
  @Column({ name: "compte_pro_valide", type: "bool", default: false })
  compteProValide: boolean;
  @Column({ name: "auth_login_attempts", type: "int", default: 0 })
  authLoginAttempts: number;
  @Column({
    name: "status",
    type: "varchar",
    nullable: false,
    default: UserStatus.Active,
  })
  status: UserStatus;

  @OneToOne(() => WalletEntity, (wallet) => wallet.owner, { nullable: true })
  wallet?: WalletEntity | string;

  @OneToMany(() => UserEntity, (user) => user.createdBy, { nullable: true })
  withdrawalRequests?: string[]; // IDs of withdrawal requests associated with the user

  // Tracking fields
  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;

  constructor(data?: OmitMethods<UserEntity>) {
    if (data) Object.assign(this, data);
  }
}
