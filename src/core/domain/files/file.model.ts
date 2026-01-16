import { OmitMethods } from "@/lib/ts-utilities";
import { FileStorage } from "./file-storage.enum";

export type ForcedFileType = "image" | "video" | "pdf";

export class FileData {
  id: string;
  fileNameDisk: string;
  title?: string;
  fileNameDownload?: string;
  externalFileId?: string;
  storage?: FileStorage;
  type?: string;
  folder?: string;

  // File metadata
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  description?: string;
  location?: string;
  tags?: string;
  metadata?: Record<string, any>;
  focalPointX?: number;
  focalPointY?: number;
  tusId?: string;
  charset?: string;
  fileSize?: number;

  createdAt?: Date;
  uploadedBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;

  constructor(data?: OmitMethods<FileData>) {
    if (data) Object.assign(this, data);
  }
}

export type File = FileData;
