import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsNotEmpty, IsOptional } from "class-validator";
import { NotificationType } from "@/core/domain/notifications";

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType, enumName: "NotificationType" })
  @IsNotEmpty()
  type: NotificationType;
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsOptional()
  collection: string;
  @ApiProperty()
  @IsOptional()
  item: string;
  @ApiProperty()
  @IsOptional()
  recipient: string;

  constructor(data?: OmitMethods<CreateNotificationDto>) {
    Object.assign(this, data);
  }
}
