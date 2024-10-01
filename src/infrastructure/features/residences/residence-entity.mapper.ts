import { IMapper } from "@/lib/ts-utilities";
import { ResidenceEntity } from "./residence.entity";
import { Residence } from "@/core/domain/residences";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";


export class ResidenceEntityMapper implements IMapper<ResidenceEntity, Residence> {
  mapFrom(param: ResidenceEntity): Residence {
    return new Residence({
      id: param.id,
      nom: param.nom,
      animauxAutorises: param.animauxAutorises,
      description: param.description,
      dureeMaxSejour: param.dureeMaxSejour,
      dureeMinSejour: param.dureeMinSejour,
      fetesAutorises: param.fetesAutorises,
      heureDepart: param.heureDepart,
      heureEntree: param.heureEntree,
      miniature: getIdFromObject(param.miniature),
      nombreMaxOccupants: param.nombreMaxOccupants,
      prixReservation: param.prixReservation,
      proprietaire: getIdFromObject(param.proprietaire),
      residenceDisponible: param.residenceDisponible,
      statusValidation: param.statusValidation,
      typeResidence: param.typeResidence,
      commune: getIdFromObject(param.commune),
      ville: getIdFromObject(param.ville),
    });
  }

  mapTo(param: Residence): ResidenceEntity {
    return new ResidenceEntity({
      ...param,
    });
  }
}