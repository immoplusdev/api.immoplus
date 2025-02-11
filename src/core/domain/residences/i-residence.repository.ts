import { IBaseRepository } from "@/core/domain/shared/repositories";
import { Residence } from "@/core/domain/residences";

export interface IResidenceRepository extends IBaseRepository<Residence, Partial<Residence>, Partial<Residence>> {}
