import { DataSource, Repository } from "typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { mapQueryFieldsToTypeormSelection, mapQueryToTypeormQuery } from "@/infrastructure/http";
import { IBaseRepository } from "@/core/domain/shared/repositories";
import { FindItemOptions, WrapperResponse } from "@/core/domain/shared/models";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/infrastructure/configs";
import { FindOptionsRelations } from "typeorm/find-options/FindOptionsRelations";
import { IMapper } from "@/lib/ts-utilities";

export type RepositoryRelations<Entity = any> = string[] | FindOptionsRelations<Entity>;

export class BaseRepository<Model, CreateDto = Partial<Model>, UpdateDto = Partial<Model>, KeyType = string> implements IBaseRepository<Model, CreateDto, UpdateDto, KeyType> {
  private readonly repository: Repository<any>;
  private readonly relations?: RepositoryRelations;
  private loadRelationIds: boolean = true;
  private entityMapper?: IMapper<any, any> = null;

  constructor(
    readonly dataSource: DataSource,
    entityClass: any,
    relations?: RepositoryRelations,
    loadRelationIds?: boolean
  ) {
    this.repository = dataSource.getRepository(entityClass);
    this.relations = relations || undefined;
    this.loadRelationIds = loadRelationIds || false;
  }

  getRepositoryInstance(): BaseRepository<any, any, any, any> {
    // FIXME: allow this method to return an instance of the repository that can be called again in a chain
    return this as never;
  }

  setEntityMapper(mapper: IMapper<any, any>) {
    this.entityMapper = mapper;
    return this.getRepositoryInstance();
  }

  setLoadRelationIds(loadRelationIds: boolean) {
    this.loadRelationIds = loadRelationIds;
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
    if (query) {
      const typeormQuery = query ? mapQueryToTypeormQuery(query) : undefined;
      const [data, total] = await this.repository.findAndCount({
        ...typeormQuery,
        relations: options?.loadRelationIds && this.relations,
        loadRelationIds: options?.loadRelationIds && this.loadRelationIds,
      });
      // result = await this.repository.find(typeormQuery);
      // total = await this.repository.count(typeormQuery.where);
      return new WrapperResponse(this.mapResponse(data)).paginate({
        totalCount: total,
        currentPage: query?._page || DEFAULT_PAGE,
        pageSize: query?._per_page || DEFAULT_PAGE_SIZE,
      });
    } else {
      const [data, total] = await this.repository.findAndCount({
        relations: options?.loadRelationIds && this.relations,
        loadRelationIds: options?.loadRelationIds && this.loadRelationIds,
      });

      return new WrapperResponse(this.mapResponse(data)).paginate({
        totalCount: total,
        currentPage: query?._page || DEFAULT_PAGE,
        pageSize: query?._per_page || DEFAULT_PAGE_SIZE,
      });
    }
  }

  async findOne(id: KeyType, options?: FindItemOptions): Promise<Model> {
    const item = await this.repository.findOne({
      where: { id },
      select: mapQueryFieldsToTypeormSelection(options?.fields),
      relations: options?.loadRelationIds && this.relations,
      loadRelationIds: options?.loadRelationIds && this.loadRelationIds,
    });
    if (!item) return null;
    return this.mapResponse(item);
  }

  async findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<Model> {
    const items = await this.findByQuery(query, options);
    if(items.data.length === 0) return null;
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
