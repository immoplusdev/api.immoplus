import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { File, IFileRepository } from "@/core/domain/files";
import { FileEntity } from "@/infrastructure/features/files";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";


@Injectable()
export class FileRepository implements IFileRepository {
  private readonly repository: BaseRepository<File>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, FileEntity);
  }

  async create(payload: Partial<File>): Promise<File> {
    return await this.repository.create(payload);
  }

  async find(query?: SearchItemsParams): Promise<File[]> {
    return await this.repository.find(query);
  }

  async findOne(id: string, fields?: []): Promise<File> {
    // TODO: Implement select and search filters
    return await this.repository.findOne(id, fields);
  }

  async updateOne(id: string, payload: Partial<File>): Promise<string> {
    await this.repository.updateOne(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }
}
