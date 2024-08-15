import { DocProperty, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ServiceDateDto } from "@/infrastructure/shared/dto";
import { ServiceDate, ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixDemandeVisiteQuery {
  @DocProperty()
  @IsNotEmpty()
  bienImmobilier: string;
  @DocProperty({ type: ServiceDate, isArray: true })
  datesReservation: ServiceDates;
  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQuery>) {
    if(data) Object.assign(this, data);
  }
}
