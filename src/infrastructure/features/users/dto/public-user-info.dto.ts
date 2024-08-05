import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";

export class PublicUserInfoDto {
   @ApiProperty()
   id: string;
   @ApiProperty()
   email: string;
   @ApiProperty()
   firstName: string;
   @ApiProperty()
   lastName: string;
   @ApiProperty()
   phoneNumber: string;
  constructor(data?: OmitMethods<PublicUserInfoDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponsePublicUserInfoDto extends WrapperResponseDto<PublicUserInfoDto> {
   @ApiProperty({ type: PublicUserInfoDto })
   data: PublicUserInfoDto;
}

export class WrapperResponsePublicUserInfoListDto extends WrapperResponseDto<PublicUserInfoDto[]> {
   @ApiProperty({ type: [PublicUserInfoDto] })
   data: PublicUserInfoDto[];
   @ApiProperty()
   currentPage: number;
   @ApiProperty()
   totalPages: number;
   @ApiProperty()
   pageSize: number;
   @ApiProperty()
   totalCount: number;
   @ApiProperty()
   hasPrevious: boolean;
   @ApiProperty()
   hasNext: boolean;
}

