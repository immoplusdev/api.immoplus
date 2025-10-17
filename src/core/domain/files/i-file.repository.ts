import { FileData } from "./file.model";
import { IBaseRepository } from "@/core/domain/common/repositories";

export interface IFileRepository
  extends IBaseRepository<FileData, Partial<FileData>, Partial<FileData>> {}
