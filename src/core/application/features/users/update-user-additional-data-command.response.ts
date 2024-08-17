import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAdditionalDataCommandResponse {
  // Pro particulier
  @ApiProperty()
  lieuNaissance: string;
  @ApiProperty()
  activite: string;
  @ApiProperty()
  photoIdentite: string;
  @ApiProperty()
  pieceIdentite: string;

  // Pro entreprise
  @ApiProperty()
  nomEntreprise: string;
  @ApiProperty()
  emailEntreprise: string;
  @ApiProperty()
  registreCommerce: string;
  @ApiProperty()
  numeroContribuable: string;
  @ApiProperty()
  typeEntreprise: string;
  constructor(data?: OmitMethods<UpdateUserAdditionalDataCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseUpdateUserAdditionalDataCommandResponseDto extends WrapperResponseDto<UpdateUserAdditionalDataCommandResponse> {
  @ApiProperty({ type: UpdateUserAdditionalDataCommandResponse })
  data: UpdateUserAdditionalDataCommandResponse;
}

