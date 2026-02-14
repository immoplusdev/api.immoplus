import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { DemandeVisiteEntity } from "./demande-visite.entity";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";
import { PublicUserInfo } from "@/core/domain/users";

export class DemandeVisiteEntityMapper
  implements IMapper<DemandeVisiteEntity, DemandeVisite>
{
  mapFrom(param: OmitMethods<DemandeVisiteEntity>): DemandeVisite {
    const createdByRaw = param.createdBy as any;
    const createdById = getIdFromObject(createdByRaw);
    const createdByModel =
      createdByRaw && typeof createdByRaw === "object"
        ? new PublicUserInfo({
            id: createdByRaw.id,
            email: createdByRaw.email,
            firstName: createdByRaw.firstName,
            lastName: createdByRaw.lastName,
            phoneNumber: createdByRaw.phoneNumber,
          })
        : undefined;

    return new DemandeVisite({
      ...param,
      bienImmobilier: param.bienImmobilier as BienImmobilier,
      createdBy: createdById,
      createdByModel,
    });
  }

  mapTo(param: OmitMethods<DemandeVisite>): DemandeVisiteEntity {
    return new DemandeVisiteEntity(param);
  }
}
