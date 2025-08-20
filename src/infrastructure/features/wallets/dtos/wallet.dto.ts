import { UserDto } from "@/core/application/users";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsUUID } from "class-validator";

export class WalletDto {
  @ApiProperty({ format: "uuid", required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ type: UserDto })
  owner: UserDto;

  @ApiProperty({ type: Number })
  availableBalance: number;

  @ApiProperty({ type: Number })
  pendingBalance: number;

  @ApiProperty({ type: String, default: "XOF" })
  currency: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(data?: WalletDto) {
    Object.assign(this, data);
  }
}

export class WrapperResponseWalletDto {
  @ApiProperty({ type: WalletDto })
  data: WalletDto;
}
