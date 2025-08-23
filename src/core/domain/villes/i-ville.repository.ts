import { IBaseRepository } from "@/core/domain/common/repositories";
import { Ville } from "@/core/domain/villes";

export interface IVilleRepository
  extends IBaseRepository<Ville, Partial<Ville>, Partial<Ville>> {}
