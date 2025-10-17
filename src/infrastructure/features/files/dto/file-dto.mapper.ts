import { FileDto } from "./file.dto";
import { FileData } from "@/core/domain/files";

export class FileDtoMapper {
  mapFrom(object: FileData): FileDto {
    return new FileDto(object);
  }

  mapTo(object: FileDto): FileData {
    return new FileData(object);
  }
}
