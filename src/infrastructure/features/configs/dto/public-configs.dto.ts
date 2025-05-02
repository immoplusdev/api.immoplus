import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { PublicConfigItemDto } from "@/infrastructure/features/configs";

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
  @ApiProperty({ type: [PublicConfigItemDto] })
  productTypes: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  galleryGroups: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  visitPaymentTypes: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  servicePaymentTypes: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  orderPaymentTypes: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  shippingTypes: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  paymentStatus: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  serviceStatus: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  shippingStatus: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  categoryPaymentTypes: PublicConfigItemDto[];
  @ApiProperty({ type: [PublicConfigItemDto] })
  languages: PublicConfigItemDto[];
  @ApiProperty({ type: PublicConfigItemDto, isArray: true })
  defaultStatus: PublicConfigItemDto[];
  @ApiProperty({ type: PublicConfigItemDto, isArray: true })
  typesResidence: PublicConfigItemDto[];

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

