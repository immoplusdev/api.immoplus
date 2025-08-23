import { DateString, Uuid } from "./global.model";
import { FileMetaData } from "./files.model";

export interface Image {
  id: Uuid;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: null;
  uploaded_by: Uuid;
  uploaded_on: DateString;
  modified_by: Uuid;
  modified_on: DateString;
  charset: string;
  filesize: number;
  width: number;
  height: number;
  duration: number;
  embed: null;
  description: string;
  location: string;
  tags: string[];
  metadata: FileMetaData;
  storage_divider: string;
}
