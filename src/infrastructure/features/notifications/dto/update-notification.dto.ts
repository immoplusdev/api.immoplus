import { IsOptional } from "class-validator";
import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { NotificationType } from "@/core/domain/notifications";

export class UpdateNotificationDto {
  @ApiProperty({ enum: NotificationType, enumName: "NotificationType" })
  @IsOptional()
  type: NotificationType;
  @ApiProperty()
  @IsOptional()
  subject: string;
  @ApiProperty()
  @IsOptional()
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

  constructor(data?: OmitMethods<UpdateNotificationDto>) {
    Object.assign(this, data);
  }
}
