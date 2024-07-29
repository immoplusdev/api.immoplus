import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserAdditionalDataCommandDto {

  // Pro particulier
  @ApiProperty()
  @IsOptional()
  lieuNaissance?: string;
  @ApiProperty()
  @IsOptional()
  activite?: string;
  @ApiProperty()
  @IsOptional()
  photoIdentite?: string;
  @ApiProperty()
  @IsOptional()
  pieceIdentite?: string;

  // Pro entreprise
  @ApiProperty()
  @IsOptional()
  nomEntreprise?: string;
  @ApiProperty()
  @IsOptional()
  emailEntreprise?: string;
  @ApiProperty()
  @IsOptional()
  registreCommerce?: string;
  @ApiProperty()
  @IsOptional()
  numeroContribuable?: string;
  @ApiProperty()
  @IsOptional()
  typeEntreprise?: string;

  constructor(data?: OmitMethods<UpdateUserAdditionalDataCommandDto>) {
    Object.assign(this, data);
  }
}
