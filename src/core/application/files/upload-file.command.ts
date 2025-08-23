import { OmitMethods } from "@/lib/ts-utilities";

export class UploadFileCommand {
  title?: string;
  folder?: string;
  description?: string;
  externalFileId?: string;
  userId: string;
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: {
      type: string;
      data: number[];
    };
    size: number;
  };

  constructor(data?: OmitMethods<UploadFileCommand>) {
    if (data) Object.assign(this, data);
  }
}
