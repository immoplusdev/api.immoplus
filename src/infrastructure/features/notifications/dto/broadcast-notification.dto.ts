import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsString,
  IsObject,
  IsUrl,
  MaxLength,
  ArrayMinSize,
} from "class-validator";
import { UserRole } from "@/core/domain/roles";
import { PushNotificationType } from "@/core/domain/notifications";

export class BroadcastNotificationDto {
  @ApiProperty({
    enum: UserRole,
    enumName: "UserRole",
    isArray: true,
    description: "Target user roles for the broadcast notification",
    example: ["customer", "pro_particulier"],
  })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @ArrayMinSize(1, { message: "At least one role must be specified" })
  roles: UserRole[];

  @ApiProperty({
    description: "Notification title/subject",
    example: "Nouvelle fonctionnalité disponible",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: "Subject must not exceed 100 characters" })
  subject: string;

  @ApiProperty({
    description: "Notification message body",
    example: "Découvrez notre nouvelle galerie de biens immobiliers premium !",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: "Message must not exceed 500 characters" })
  message: string;

  @ApiProperty({
    enum: PushNotificationType,
    enumName: "PushNotificationType",
    required: false,
    description: "Notification category/type for tracking",
    example: "residence",
  })
  @IsOptional()
  @IsEnum(PushNotificationType)
  type?: PushNotificationType;

  @ApiProperty({
    required: false,
    description: "Custom data payload to include with the notification",
    example: { campaign_id: "launch_2024", priority: "high" },
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({
    required: false,
    description: "Deep link URL to open when notification is tapped",
    example: "app://properties/featured",
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    required: false,
    description:
      "Image URL to display in the notification (supports Android big_picture and iOS attachments)",
    example: "https://example.com/images/property-featured.jpg",
  })
  @IsOptional()
  @IsUrl({}, { message: "Image URL must be a valid URL" })
  imageUrl?: string;

  constructor(data?: OmitMethods<BroadcastNotificationDto>) {
    if (data) Object.assign(this, data);
  }
}
