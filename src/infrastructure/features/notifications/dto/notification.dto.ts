import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { NotificationType } from "@/core/domain/notifications/notification-type.enum";
import { IsOptional } from "class-validator";

export class NotificationDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
  @ApiProperty()
  @IsOptional()
  type?: NotificationType;
  @ApiProperty()
  @IsOptional()
  subject?: string;
  @ApiProperty()
  @IsOptional()
  message?: string;
  @ApiProperty()
  @IsOptional()
  collection?: string;
  @ApiProperty()
  @IsOptional()
  item?: string;
  @ApiProperty()
  @IsOptional()
  recipient?: string;
  @ApiProperty()
  @IsOptional()
  createdAt?: Date;
  @ApiProperty()
  @IsOptional()
  createdBy?: string;
  @ApiProperty()
  @IsOptional()
  updatedAt?: Date;
  @ApiProperty()
  @IsOptional()
  updatedBy?: string;
  @ApiProperty()
  @IsOptional()
  deletedAt?: Date;
  @ApiProperty()
  @IsOptional()
  deletedBy?: string;

  constructor(data?: OmitMethods<NotificationDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseNotificationDto extends WrapperResponseDto<NotificationDto> {
  @ApiProperty({ type: NotificationDto })
  data: NotificationDto;
}

export class WrapperResponseNotificationListDto extends WrapperResponseDto<NotificationDto[]> {
  @ApiProperty({ type: [NotificationDto] })
  data: NotificationDto[];
}

