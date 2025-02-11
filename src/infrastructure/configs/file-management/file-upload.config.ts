import { IFileUploadConfig } from "@/core/domain/files";

export const fileUploadConfig: IFileUploadConfig = {
  uploadPath: "uploads",
  parseName: (fileName: string) => fileName.replace(`\\`, "/"),
};
