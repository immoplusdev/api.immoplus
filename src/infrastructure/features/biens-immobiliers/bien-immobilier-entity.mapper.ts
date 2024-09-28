import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierEntity } from "./bien-immobilier.entity";
import { getIdFromObject } from "@/infrastructure/db/helpers";


export class BienImmobilierEntityMapper implements IMapper<BienImmobilierEntity, BienImmobilier> {
  mapFrom(object: OmitMethods<BienImmobilierEntity>): BienImmobilier {
    return new BienImmobilier({
      id: object.id,
      miniature: getIdFromObject(object.miniature),
      nom: object.nom,
      typeBienImmobilier: object.typeBienImmobilier,
      description: object.description,
      typeLocation: object.typeLocation,
      aLouer: object.aLouer,
      amentities: object.amentities,
      tags: object.tags,
      images: object.images,
      video: getIdFromObject(object.video),
      ville: getIdFromObject(object.ville),
      commune: getIdFromObject(object.commune),
      adresse: object.adresse,
      position: object.position,
      statusValidation: object.statusValidation,
      prix: object.prix,
      metadata: object.metadata,
      featured: object.featured,
      nombreMaxOccupants: object.nombreMaxOccupants,
      animauxAutorises: object.animauxAutorises,
      bienImmobilierDisponible: object.bienImmobilierDisponible,
      fetesAutorises: object.fetesAutorises,
      reglesSupplementaires: object.reglesSupplementaires,
      proprietaire: object.proprietaire,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
      deletedAt: object.deletedAt,
      createdBy: object.createdBy,
    });
  }

  mapTo(object: OmitMethods<BienImmobilier>): BienImmobilierEntity {
    return new BienImmobilierEntity(object);
  }
}
