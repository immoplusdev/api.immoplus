import { DataSource, Repository } from "typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { mapQueryFieldsToTypeormSelection, mapQueryToTypeormQuery } from "@/infrastructure/http";
import { IBaseRepository } from "@/core/domain/shared/repositories";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";
import { WrapperResponse } from "@/core/domain/shared/models";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/infrastructure/configs";

export class BaseRepository<Model, CreateDto = Partial<Model>, UpdateDto = Partial<Model>, KeyType = string> implements IBaseRepository<Model, CreateDto, UpdateDto, KeyType> {
  private readonly repository: Repository<any>;

  constructor(
    readonly dataSource: DataSource,
    entityClass: any,
  ) {
    this.repository = dataSource.getRepository(entityClass);
  }

  async createMany(payload: CreateDto[]): Promise<Model[]> {
    return await Promise.all(payload.map(async (item) => await this.createOne(item)));
  }

  async createOne(payload: CreateDto): Promise<Model> {
    return await this.repository.save(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Model[]>> {
    if (query) {
      const typeormQuery = query ? mapQueryToTypeormQuery(query) : undefined;
      const [data, total] = await this.repository.findAndCount(typeormQuery);
      // result = await this.repository.find(typeormQuery);
      // total = await this.repository.count(typeormQuery.where);
      return new WrapperResponse(data).paginate({
        totalCount: total,
        currentPage: query._page || DEFAULT_PAGE,
        pageSize: query._per_page || DEFAULT_PAGE_SIZE,
      });
    } else {
      const [data, total] = await this.repository.findAndCount();
      return new WrapperResponse(data).paginate({
        totalCount: total,
        currentPage: query._page || DEFAULT_PAGE,
        pageSize: query._per_page || DEFAULT_PAGE_SIZE,
      });
    }
  }

  async findOne(id: KeyType, fields?: KeyType[]): Promise<Model> {
    const item = await this.repository.findOne({ where: { id }, select: mapQueryFieldsToTypeormSelection(fields) });
    if (item == null) throw new ItemNotFoundException();
    return item;
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
}
