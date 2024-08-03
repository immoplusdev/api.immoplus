import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { PublicConfigItem } from "@/core/domain/configs/public-config-item.model";

export class PublicConfigDto {
  @ApiProperty()
  websiteUrl: string;
  @ApiProperty()
  normalVisitPrice: number;
  @ApiProperty()
  expressVisitPrice: number;
  @ApiProperty()
  projectName: string;
  @ApiProperty()
  projectUrl: string;
  @ApiProperty()
  projectLogo: string;
  @ApiProperty()
  smsSenderName: string;
  @ApiProperty()
  proximityRadius: number;
  @ApiProperty()
  standardShippingPrice: number;
  @ApiProperty()
  flashShippingPrice: number;
  @ApiProperty()
  contactEmail: string;
  @ApiProperty()
  contactPhoneNumber: string;
  @ApiProperty({ type: [PublicConfigItem] })
  productTypes: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  galleryGroups: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  visitPaymentTypes: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  servicePaymentTypes: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  orderPaymentTypes: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  shippingTypes: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  paymentStatus: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  serviceStatus: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  shippingStatus: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  categoryPaymentTypes: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  languages: PublicConfigItem[];
  @ApiProperty({ type: [PublicConfigItem] })
  defaultStatus: PublicConfigItem[];

  constructor(data?: OmitMethods<PublicConfigDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponsePublicConfigDto extends WrapperResponseDto<PublicConfigDto> {
  @ApiProperty({ type: PublicConfigDto })
  data: PublicConfigDto;
}

export class WrapperResponsePublicConfigListDto extends WrapperResponseDto<PublicConfigDto[]> {
  @ApiProperty({ type: [PublicConfigDto] })
  data: PublicConfigDto[];
}

