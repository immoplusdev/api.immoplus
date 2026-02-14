import { IBaseRepository } from "@/core/domain/common/repositories";
import { Furniture } from "./furniture.model";


/**
 * Interface pour le repository des meubles
 * @description Cette interface définit les méthodes pour interagir avec la base de données pour les meubles
 * Ne pas oublier de revenir pour ameliorer en cas de changement. @Marc
 */
export interface IFurnitureRepository
  extends IBaseRepository<
    Furniture,
    Partial<Furniture>,
    Partial<Furniture>
  > {}
