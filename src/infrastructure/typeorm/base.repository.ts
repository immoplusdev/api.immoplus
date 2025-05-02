import { DataSource, Raw, Repository } from "typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { mapQueryFieldsToTypeormSelection, mapQueryToTypeormQuery } from "@/infrastructure/http";
import { IBaseRepository } from "@/core/domain/common/repositories";
import { FindItemOptions, RepositoryRelations, WrapperResponse } from "@/core/domain/common/models";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/infrastructure/configs";
import { IMapper } from "@/lib/ts-utilities";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

export type LoadRelationIdsOptions = boolean | {
  relations?: string[];
  disableMixedMap?: boolean;
};

export class BaseRepository<Model, CreateDto = Partial<Model>, UpdateDto = Partial<Model>, KeyType = string> implements IBaseRepository<Model, CreateDto, UpdateDto, KeyType> {
  private readonly repository: Repository<any>;
  private relations?: RepositoryRelations;
  private fullTextSearchFields?: string[];
  private loadRelationIds: LoadRelationIdsOptions = true;
  private entityMapper?: IMapper<any, any> = null;

  constructor(
    readonly dataSource: DataSource,
    entityClass: any,
    relations?: RepositoryRelations,
    loadRelationIds?: LoadRelationIdsOptions,
  ) {
    this.repository = dataSource.getRepository(entityClass);
    this.relations = relations || undefined;
    this.loadRelationIds = loadRelationIds || false;
  }

  getRepositoryInstance(): BaseRepository<any, any, any, any> {
    return this as never;
  }


  setFullTextSearchFields(fields: string[]) {
    this.fullTextSearchFields = fields;
    return this.getRepositoryInstance();
  }

  setEntityMapper(mapper: IMapper<any, any>) {
    this.entityMapper = mapper;
    return this.getRepositoryInstance();
  }

  setLoadRelationIds(loadRelationIds: LoadRelationIdsOptions) {
    this.loadRelationIds = loadRelationIds;
    return this.getRepositoryInstance();
  }

  setRelations(relations: RepositoryRelations) {
    this.relations = relations;
    return this.getRepositoryInstance();
  }

  async createMany(payload: CreateDto[], returnPayload: boolean = true): Promise<Model[]> {
    const result = await Promise.all(payload.map(async (item) => await this.createOne(item, returnPayload)));
    if (returnPayload) return result;
    return [];
  }

  async createOne(payload: CreateDto, returnData: boolean = true): Promise<Model> {
    const { id } = await this.repository.save(payload);
    if (returnData) return await this.findOne(id);
    return { id } as never;
  }

  async findByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<WrapperResponse<Model[]>> {

    const paginationOptions = {
      currentPage: parseInt(query?._page as never) || DEFAULT_PAGE,
      pageSize: parseInt(query?._per_page as never) || DEFAULT_PAGE_SIZE,
    };

    const queryOptions: FindManyOptions<Model> = {
      relations: (options?.loadRelationIds || this.relations) as never,
      loadRelationIds: options?.loadRelationIds || this.loadRelationIds,
    };


    if (query) {
      const options = {
        ...(query ? mapQueryToTypeormQuery(query) : {}),
        ...queryOptions,
      };

      if (query._search && this.fullTextSearchFields) {
        const entityName = this.repository.metadata.targetName;
        const firstField = this.fullTextSearchFields[0];
        const otherFields = this.fullTextSearchFields.slice(1);
        let rawSearchQuery = `${entityName}.${firstField} LIKE :pattern `;

        otherFields.forEach(field => {
          rawSearchQuery += `OR ${entityName}.${field} LIKE :pattern `;
        });
        options.where[firstField] = Raw(() => rawSearchQuery, { pattern: `%${query._search}%` });
      }

      const [data, total] = await this.repository.findAndCount({
        ...options,
      });

      return new WrapperResponse(this.mapResponse(data)).paginate({
        ...paginationOptions,
        totalCount: total,

      });
    } else {
      const [data, total] = await this.repository.findAndCount(queryOptions);

      return new WrapperResponse(this.mapResponse(data)).paginate({
        ...paginationOptions,
        totalCount: total,
      });
    }
  }

  async findOne(id: KeyType, options?: FindItemOptions): Promise<Model> {
    const item = await this.repository.findOne({
      where: { id },
      select: mapQueryFieldsToTypeormSelection(options?.fields),
      relations: (options?.relations || this.relations) as never,
      loadRelationIds: options?.loadRelationIds || this.loadRelationIds,
    });
    if (!item) return null;
    return this.mapResponse(item);
  }

  async findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<Model> {
    const items = await this.findByQuery(query, options);
    if (items.data.length === 0) return null;
    return items.data[0];
  }

  async updateByQuery(query: SearchItemsParams, payload: UpdateDto): Promise<KeyType[]> {
    const result = await this.repository.update(mapQueryToTypeormQuery(query).where, payload);
    return result.affected && result.affected[0] ? result.affected[0] : [];
  }

  async updateOne(id: KeyType, payload: UpdateDto): Promise<KeyType> {
    await this.repository.update(id, payload);
    return id;
  }

  async deleteByQuery(query: SearchItemsParams): Promise<KeyType[]> {
    const result = await this.repository.softDelete(mapQueryToTypeormQuery(query).where);
    return result.affected && result.affected[0] ? result.affected[0] : [];
  }

  async deleteOne(id: KeyType): Promise<KeyType> {
    await this.repository.softDelete(id);
    return id;
  }

  mapResponse(data: any) {
    if (!this.entityMapper) return data;

    if (Array.isArray(data)) return data.map(item => this.entityMapper.mapFrom(item));

    return this.entityMapper.mapFrom(data);
  }
}
