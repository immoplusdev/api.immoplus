import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";

export class UserDataDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  lieuNaissance?: string;
  @ApiProperty()
  activite?: string;
  @ApiProperty()
  photoIdentiteId?: string;
  @ApiProperty()
  pieceIdentiteId?: string;

  // Pro entreprise
  @ApiProperty()
  nomEntreprise?: string;
  @ApiProperty()
  emailEntreprise?: string;
  @ApiProperty()
  registreCommerceId?: string;
  @ApiProperty()
  numeroContribuable?: string;
  @ApiProperty()
  typeEntreprise?: string;
  constructor(data?: OmitMethods<UserDataDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseUserDataDto extends WrapperResponseDto<UserDataDto> {
   @ApiProperty({ type: UserDataDto })
   data: UserDataDto;
}

export class WrapperResponseUserDataListDto extends WrapperResponseDto<UserDataDto[]> {
   @ApiProperty({ type: [UserDataDto] })
   data: UserDataDto[];
}

