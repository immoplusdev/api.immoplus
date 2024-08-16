import { OmitMethods } from "@/lib/ts-utilities";
import { PublicUserInfo } from "@/core/domain/users";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";

export class GetDemandeVisiteByIdQueryResponse extends DemandeVisite {
  bienImmobilier: BienImmobilier;
  client: PublicUserInfo;
  proprietaire: PublicUserInfo;

  constructor(data?: OmitMethods<GetDemandeVisiteByIdQueryResponse>) {
    if (data) super(data);
  }
}
