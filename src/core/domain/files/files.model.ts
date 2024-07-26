import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "@/core/domain/users";

export class File {
  id: string;
  fileNameDisk: string;
  title?: string;
  fileNameDownload?: string;
  storage?: string;
  type?: string;
  folder?: string;
  uploadedBy?: User | string;
  uploadedOn?: Date;
  modifiedBy?: User | string;
  modifiedOn?: Date;
  deletedOn?: Date;
  charset?: string;
  fileSize?: number;
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
  tusData?: Record<string, any>;
  constructor(data?: OmitMethods<File>) {
    if (data) Object.assign(this, data);
  }
}
