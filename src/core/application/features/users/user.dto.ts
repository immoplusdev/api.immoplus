import { UserStatus } from "@/core/domain/users/user-status.enum";
import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";
import { RoleDto } from "@/infrastructure/features/roles";
import { UserData } from "@/core/domain/users";
import { UserDataDto } from "@/core/application/features/users";

export class UserDto {

  // basic fields
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ type: RoleDto })
  role: RoleDto | string;
  @ApiProperty()
  language?: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  otp?: string;
  @ApiProperty()
  otpExpiration?: Date;

  // User Data
  @ApiProperty()
  country?: string;
  @ApiProperty()
  state?: string;
  @ApiProperty()
  city?: string;
  @ApiProperty()
  commune?: string;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  address2?: string;
  @ApiProperty()
  currency?: string;
  @ApiProperty({ type: UserDataDto })
  additionalData?: UserData | string;

  // Status and Dates
  @ApiProperty()
  identityVerified: boolean;
  @ApiProperty()
  emailVerified: boolean;
  @ApiProperty()
  phoneNumberVerified: boolean;
  @ApiProperty()
  compteProValide: boolean;
  @ApiProperty()
  authLoginAttempts: number;
  @ApiProperty()
  status: UserStatus;

  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;

  clearPrivateCredentials() {
    this.password = "********";
    this.otp = "********";
    return this;
  }

  constructor(data?: OmitMethods<UserDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseUserDto extends WrapperResponseDto<UserDto> {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class WrapperResponseUserListDto extends WrapperResponseDto<UserDto[]> {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}
