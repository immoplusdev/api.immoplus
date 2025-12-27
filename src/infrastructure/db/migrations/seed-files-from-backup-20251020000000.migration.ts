import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "fs";
import * as path from "path";

type FilesBackupEntry = {
  type: string;
  name?: string;
  data?: FileRow[];
};

type FileRow = {
  id: string;
  filename_disk: string;
  title: string | null;
  filename_download: string | null;
  storage: string;
  type: string | null;
  folder: string | null;
  uploaded_on: string;
  modified_on: string;
  deleted_on: string | null;
  charset: string | null;
  filesize: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  embed: string | null;
  description: string | null;
  location: string | null;
  tags: string | null;
  metadata: unknown | null;
  focal_point_x: number | null;
  focal_point_y: number | null;
  tus_id: string | null;
  tus_data: unknown | null;
  uploaded_by: string | null;
  modified_by: string | null;
  external_file_id: string | null;
};

export class SeedFilesFromBackup20251020000000 implements MigrationInterface {
  private readonly columns = [
    "id",
    "filename_disk",
    "title",
    "filename_download",
    "storage",
    "type",
    "folder",
    "uploaded_on",
    "modified_on",
    "deleted_on",
    "charset",
    "filesize",
    "width",
    "height",
    "duration",
    "embed",
    "description",
    "location",
    "tags",
    "metadata",
    "focal_point_x",
    "focal_point_y",
    "tus_id",
    "tus_data",
    "uploaded_by",
    "modified_by",
    "external_file_id",
  ] as const;

  async up(queryRunner: QueryRunner): Promise<void> {
    const files = this.loadFilesBackup();
    const placeholders = this.columns.map(() => "?").join(", ");

    for (const file of files) {
      const values = this.columns.map((column) =>
        (file as Record<string, unknown>)[column] ?? null,
      );

      await queryRunner.query(
        `INSERT INTO files (${this.columns.join(
          ", ",
        )}) VALUES (${placeholders})`,
        values,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const files = this.loadFilesBackup();

    if (files.length === 0) {
      return;
    }

    const ids = files.map((file) => file.id);
    const chunkSize = 500;

    for (let start = 0; start < ids.length; start += chunkSize) {
      const chunk = ids.slice(start, start + chunkSize);
      const placeholders = chunk.map(() => "?").join(", ");

      await queryRunner.query(
        `DELETE FROM files WHERE id IN (${placeholders})`,
        chunk,
      );
    }
  }

  private loadFilesBackup(): FileRow[] {
    const backupPath = path.resolve(
      __dirname,
      "../../../../scripts/migration/files-backup.json",
    );
    const rawContent = fs.readFileSync(backupPath, "utf8");
    const cleanedContent = rawContent.replace(/^\\s*\\[\\]\\s*/, "");
    const parsed = JSON.parse(cleanedContent) as FilesBackupEntry[];
    const filesTable = parsed.find(
      (entry) => entry.type === "table" && entry.name === "files",
    );

    if (!filesTable || !filesTable.data) {
      throw new Error("Unable to find files backup data");
    }

    return filesTable.data;
  }
}
