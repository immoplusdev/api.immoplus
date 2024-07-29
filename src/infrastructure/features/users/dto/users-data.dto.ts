import { ApiProperty } from "@nestjs/swagger";
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
  photoIdentite?: string;
  @ApiProperty()
  pieceIdentite?: string;

  // Pro entreprise
  @ApiProperty()
  nomEntreprise?: string;
  @ApiProperty()
  emailEntreprise?: string;
  @ApiProperty()
  registreCommerce?: string;
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

