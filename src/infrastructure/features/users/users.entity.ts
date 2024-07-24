import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from '@/core/domain/users/user-status.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;
  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;
  @Column({ name: 'email', type: 'varchar' })
  email: string;
  @Column({ name: 'password', type: 'varchar' })
  password: string;
  @Column({ name: 'role', type: 'varchar' })
  role: string;
  @Column({ name: 'language', type: 'varchar', nullable: true })
  language?: string;
  @Column({ name: 'avatar', type: 'varchar', nullable: true })
  avatar?: string;
  @Column({ name: 'verification_code', type: 'varchar', nullable: true })
  verificationCode?: string;
  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;
  @Column({ name: 'otp', type: 'varchar', nullable: true })
  otp?: string;
  @Column({ name: 'country', type: 'varchar', nullable: true })
  country?: string;
  @Column({ name: 'state', type: 'varchar', nullable: true })
  state?: string;
  @Column({ name: 'city', type: 'varchar', nullable: true })
  city?: string;
  @Column({ name: 'commune', type: 'varchar', nullable: true })
  commune?: string;
  @Column({ name: 'address', type: 'varchar', nullable: true })
  address?: string;
  @Column({ name: 'address_2', type: 'varchar', nullable: true })
  address2?: string;
  @Column({ name: 'email_verified', type: 'varchar', nullable: true })
  emailVerified: boolean;
  @Column({ name: 'phone_number_verified', type: 'bool', default: false })
  phoneNumberVerified: boolean;
  @Column({ name: 'currency', type: 'varchar', nullable: true })
  currency?: string;
  @Column({ name: 'auth_login_attempts', type: 'int', default: 0 })
  authLoginAttempts: number;
  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
    default: UserStatus.Active,
  })
  status: UserStatus;
}
