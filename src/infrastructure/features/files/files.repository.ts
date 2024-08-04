import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { File, IFileRepository } from "@/core/domain/files";
import { FileEntity } from "@/infrastructure/features/files";
import { SearchItemsParams } from "@/core/domain/http";
import { BaseRepository } from "@/infrastructure/typeorm";
import { WrapperResponse } from "@/core/domain/shared/models";


@Injectable()
export class FileRepository implements IFileRepository {
  private readonly repository: BaseRepository<File>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, FileEntity);
  }

  async createMany(payload: Partial<File>[]): Promise<File[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<File>): Promise<File> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<File[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, fields?: []): Promise<File> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<File>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<File>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
