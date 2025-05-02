import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { DemandeVisite, IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { DemandeVisiteEntity, DemandeVisiteEntityMapper } from "@/infrastructure/features/demandes-visites";
import { BaseRepository } from "@/infrastructure/typeorm";
import { ItemsParamsCriterias, ItemsParamsOrderDirection, SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, RepositoryRelations, WrapperResponse } from "@/core/domain/common/models";

@Injectable()
export class DemandeVisiteRepository implements IDemandeVisiteRepository {
  private readonly repository: BaseRepository<DemandeVisite>;
  private readonly relations: RepositoryRelations = ["bienImmobilier"];
  private readonly fullTextSearchFields: string[] = ["id",
    "id",
    "bienImmobilier",
    "statusDemandeVisite",
    "typeDemandeVisite",
    "datesDemandeVisite",
    "statusFacture",
    "retraitProEffectue",
    "montantTotalDemandeVisite",
    "montantDemandeVisiteSansCommission",
    "notes",
    "clientPhoneNumber",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "createdBy",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
    @Inject(Deps.BiensImmobiliesRepository) private readonly biensImmobiliesRepository: IDemandeVisiteRepository,
  ) {
    this.repository = new BaseRepository(dataSource, DemandeVisiteEntity, this.relations)
      .setEntityMapper(new DemandeVisiteEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }


  async createMany(payload: Partial<DemandeVisite>[]): Promise<DemandeVisite[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<DemandeVisite>): Promise<DemandeVisite> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<WrapperResponse<DemandeVisite[]>> {
    return await this.repository.findByQuery(query, options);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<DemandeVisite> {
    return this.repository.findOne(id, options);
  }

  async findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<DemandeVisite> {
    return this.repository.findOneByQuery(query, options);
  }

  async findByBienImmobilierOwnerId(ownerId: string, query?: SearchItemsParams): Promise<WrapperResponse<DemandeVisite[]>> {
    const idsResponse = await this.biensImmobiliesRepository.findByQuery({
      _where:
        [
          {
            _field: "proprietaire",
            _op: "eq",
            _val: ownerId,
          },
        ],
    }, { fields: ["id"], relations: [] });

    const idFilter: ItemsParamsCriterias = {
      _field: "bienImmobilier",
      _op: "in",
      _val: idsResponse.data.map((item) => item.id),
    };

    const whereClause: ItemsParamsCriterias[] = query._where ? [...query._where, idFilter] : [idFilter];

    return await this.findByQuery({
      ...(query || {}),
      _where: whereClause,
    });
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<DemandeVisite>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<DemandeVisite>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
