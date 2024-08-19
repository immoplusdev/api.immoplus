import { DataSource, Repository } from "typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { mapQueryFieldsToTypeormSelection, mapQueryToTypeormQuery } from "@/infrastructure/http";
import { IBaseRepository } from "@/core/domain/shared/repositories";
import { FindItemOptions, RepositoryRelations, WrapperResponse } from "@/core/domain/shared/models";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/infrastructure/configs";
import { FindOptionsRelations } from "typeorm/find-options/FindOptionsRelations";
import { IMapper } from "@/lib/ts-utilities";

// type TypeormRepositoryRelations<Entity = any> = string[] | FindOptionsRelations<Entity>;
export type LoadRelationIdsOptions = boolean | {
  relations?: string[];
  disableMixedMap?: boolean;
};


export class BaseRepository<Model, CreateDto = Partial<Model>, UpdateDto = Partial<Model>, KeyType = string> implements IBaseRepository<Model, CreateDto, UpdateDto, KeyType> {
  private readonly repository: Repository<any>;
  private relations?: RepositoryRelations;
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

    const queryOptions = {
      relations: options?.loadRelationIds || this.relations,
      loadRelationIds: options?.loadRelationIds || this.loadRelationIds,
    } as any;


    if (query) {
      const typeormQuery = query ? mapQueryToTypeormQuery(query) : undefined;
      const [data, total] = await this.repository.findAndCount({
        ...typeormQuery,
        ...queryOptions,
      });
      // result = await this.repository.find(typeormQuery);
      // total = await this.repository.count(typeormQuery.where);
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
