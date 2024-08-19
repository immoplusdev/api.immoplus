import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ServiceDateDto } from "@/core/application/shared/dto";

export class CreateReservationCommand {
  @IsOptional()
  userId: string;
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

  setClientPhoneNumber(phoneNumber: string) {
    this.clientPhoneNumber = phoneNumber;
  }

  constructor(data?: OmitMethods<CreateReservationCommand>) {
    if (data) Object.assign(this, data);
  }
}