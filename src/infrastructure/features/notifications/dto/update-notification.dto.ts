import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';
import { IsOptional } from "class-validator";
import { NotificationType } from "@/core/domain/notifications";

export class UpdateNotificationDto {
  @ApiProperty()
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