import {DateString, Uuid} from "@/core/domain/shared/models/global.model";
import {FileMetaData} from "@/core/domain/shared/models/files.model";

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


