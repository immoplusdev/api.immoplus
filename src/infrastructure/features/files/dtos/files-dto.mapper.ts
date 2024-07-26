import { AutoMapper, IMapper } from "@/lib/ts-utilities";
import { File } from "@/core/domain/files";
import { FileDto } from "./files.dto";


export class FileDtoMapper {
  private mapper: AutoMapper;
  constructor() {
    this.mapper = new AutoMapper();
  }

  mapFrom(object: File): FileDto {
    return this.mapper.execute<File, FileDto>(object);
  }

  mapTo(object: FileDto): File {
    return this.mapper.execute<FileDto, File>(object);
  }
}
