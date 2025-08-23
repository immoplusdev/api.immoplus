import { join } from "path";
import { fileUploadConfig } from "@/infrastructure/configs";

export function getFilePath(fileNameDisk: string) {
  return join(process.cwd(), `${fileUploadConfig.uploadPath}/${fileNameDisk}`);
}
