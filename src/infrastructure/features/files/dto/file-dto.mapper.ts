import { File } from "@/core/domain/files";
import { FileDto } from "./file.dto";

export class FileDtoMapper {
  mapFrom(object: File): FileDto {
    return new FileDto(object);
  }

  mapTo(object: FileDto): File {
    return new File(object);
  }
}
