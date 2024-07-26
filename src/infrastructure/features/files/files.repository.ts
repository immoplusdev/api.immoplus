import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { File, IFileRepository } from "@/core/domain/files";
import { FileEntity } from '@/infrastructure/features/files';


@Injectable()
export class FileRepository implements IFileRepository{
  private readonly repository: Repository<FileEntity>;
  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(FileEntity);
  }

  async create(payload: Partial<File>): Promise<File> {
    return await this.repository.save(payload);
  }

  async find(): Promise<File[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<File> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, payload: Partial<File>): Promise<string> {
    await this.repository.update(id, payload);
    return id;
  }

  async delete(id: string): Promise<string> {
    await this.repository.delete(id);
    return id;
  }
}
