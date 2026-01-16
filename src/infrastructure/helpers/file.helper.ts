import { join } from "path";
import { fileUploadConfig } from "@/infrastructure/configs";

export function getFilePath(fileNameDisk: string) {
  return join(process.cwd(), `${fileUploadConfig.uploadPath}/${fileNameDisk}`);
}

export function hasFileExtension(url: string) {
  const path = new URL(url).pathname;
  const lastPart = path.split("/").pop();

  // Check if the file has an extension (contains a dot)
  return lastPart?.includes(".") || false;
}
