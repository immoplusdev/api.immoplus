import { DataSource, Repository } from "typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { mapQueryToTypeormQuery } from "@/infrastructure/http";
import { IBaseRepository } from "@/core/domain/shared/repositories";
import { ItemNotFoundException, UnexpectedException } from "@/core/domain/shared/exceptions";

export class BaseRepository<Model, CreateDto = Partial<Model>, UpdateDto = Partial<Model>, KeyType = string> implements IBaseRepository<Model, CreateDto, UpdateDto, KeyType> {
  private readonly repository: Repository<any>;

  constructor(
    readonly dataSource: DataSource,
    entityClass: any,
  ) {
    this.repository = dataSource.getRepository(entityClass);
  }

  async create(payload: CreateDto): Promise<Model> {
    return await this.repository.save(payload);
  }

  async find(query?: SearchItemsParams): Promise<Model[]> {
    // TODO: Implement select and search filters
    if (query) {
      const params = mapQueryToTypeormQuery(query);
      return await this.repository.find(params);
    }
    return await this.repository.find();
  }

  async findOne(id: KeyType, fields?: []): Promise<Model> {
    // TODO: Implement select and search filters
    const item = await this.repository.findOneBy({ id });
    if (item == null) throw new ItemNotFoundException();
    return item;
  }

  async update(id: KeyType, payload: UpdateDto): Promise<KeyType> {
    await this.repository.update(id, payload);
    return id;
  }

  async delete(id: KeyType): Promise<KeyType> {
    await this.repository.softDelete(id);
    return id;
  }
}
