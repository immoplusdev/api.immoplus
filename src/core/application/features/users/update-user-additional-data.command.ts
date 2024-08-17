import { OmitMethods } from '@/lib/ts-utilities';
import { User } from "@/core/domain/users";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserAdditionalDataCommand {
  @IsOptional()
  userId: string;
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

  constructor(data?: OmitMethods<UpdateUserAdditionalDataCommand>) {
    if(data) Object.assign(this, data);
  }
}