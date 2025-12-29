import { IsOptional } from "class-validator";
import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
export class SendTestNotificationDto {
  @ApiProperty()
  @IsOptional()
  userId: string;
  @ApiProperty()
  subject: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  @IsOptional()
  skipInAppNotification: boolean;
  @ApiProperty()
  @IsOptional()
  sendMail: boolean;
  @ApiProperty()
  @IsOptional()
  sendSms: boolean;
  @ApiProperty()
  @IsOptional()
  htmlMessage: string;
  @ApiProperty()
  @IsOptional()
  returnUrl?: string;
  @ApiProperty()
  @IsOptional()
  data?: Record<string, any>;

  constructor(data?: OmitMethods<SendTestNotificationDto>) {
    Object.assign(this, data);
  }
}
