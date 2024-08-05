import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDates } from "@/core/domain/shared/models";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ServiceDateDto } from "@/infrastructure/shared/dto";

export class CreateReservationCommandDto {
  @ApiProperty({ format: "uuid" })
  @IsNotEmpty()
  residence: string;
  @ApiProperty({ type: ServiceDateDto, isArray: true })
  datesReservation: ServiceDateDto[];
  @ApiProperty()
  @IsOptional()
  clientPhoneNumber?: string;
  @ApiProperty()
  @IsOptional()
  notes?: string;

  constructor(data?: OmitMethods<CreateReservationCommandDto>) {
    Object.assign(this, data);
  }
}
