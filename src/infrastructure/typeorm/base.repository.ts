import { DataSource, Repository } from "typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { mapQueryFieldsToTypeormSelection, mapQueryToTypeormQuery } from "@/infrastructure/http";
import { IBaseRepository } from "@/core/domain/shared/repositories";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";

export class BaseRepository<Model, CreateDto = Partial<Model>, UpdateDto = Partial<Model>, KeyType = string> implements IBaseRepository<Model, CreateDto, UpdateDto, KeyType> {
  private readonly repository: Repository<any>;

  constructor(
    readonly dataSource: DataSource,
    entityClass: any
  ) {
    this.repository = dataSource.getRepository(entityClass);
  }

  async create(payload: CreateDto): Promise<Model> {
    return await this.repository.save(payload);
  }

  async find(query: SearchItemsParams): Promise<Model[]> {
    if (query) {
      const params = mapQueryToTypeormQuery(query);
      return await this.repository.find(params);
    }
    return await this.repository.find();
  }

  async findOne(id: KeyType, fields?: KeyType[]): Promise<Model> {
    const item = await this.repository.findOne({ where: { id }, select: mapQueryFieldsToTypeormSelection(fields) });
    if (item == null) throw new ItemNotFoundException();
    return item;
  }


  async update(id: KeyType, payload: UpdateDto): Promise<KeyType> {
    await this.repository.update(id, payload);
    return id;
  }

  async updateOne(id: KeyType, payload: UpdateDto): Promise<KeyType> {
    await this.repository.update(id, payload);
    return id;
  }

  async delete(id: KeyType): Promise<KeyType> {
    await this.repository.softDelete(id);
    return id;
  }
}
