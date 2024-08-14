import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsNotEmpty, IsOptional } from "class-validator";
import { NotificationType } from "@/core/domain/notifications";

export class CreateNotificationDto {
  @ApiProperty()
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