import { IBaseRepository } from '@/core/domain/shared/repositories';
import { File } from '@/core/domain/files';


export interface IFileRepository extends IBaseRepository<File, Partial<File>, Partial<File>> {}
