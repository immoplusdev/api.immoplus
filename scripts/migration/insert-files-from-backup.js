const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const COLUMNS = [
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
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl:
      process.env.DB_SSL_ENABLED === "true"
        ? {
            ca: process.env.DB_SSL_CA_STRING,
            rejectUnauthorized:
              process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
          }
        : undefined,
  });

  try {
    const files = loadFilesBackup();
    const updateClause = COLUMNS.map((c) => `${c}=VALUES(${c})`).join(", ");

    const chunkSize = 300;
    for (let start = 0; start < files.length; start += chunkSize) {
      const chunk = files.slice(start, start + chunkSize);
      const rowPlaceholders = `(${COLUMNS.map(() => "?").join(", ")})`;
      const allPlaceholders = chunk.map(() => rowPlaceholders).join(", ");
      const insertSql = `INSERT INTO files (${COLUMNS.join(
        ", ",
      )}) VALUES ${allPlaceholders} ON DUPLICATE KEY UPDATE ${updateClause}`;

      const flatValues = chunk.flatMap((row) =>
        COLUMNS.map((col) => toDbValue(row[col])),
      );

      await connection.query(insertSql, flatValues);
      console.log(
        `Inserted ${Math.min(start + chunkSize, files.length)} of ${
          files.length
        }`,
      );
    }

    console.log("Done.");
  } finally {
    await connection.end();
  }
}

function toDbValue(value) {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function loadFilesBackup() {
  const backupPath = "./scripts/migration/files-backup.json";
  const rawContent = fs.readFileSync(backupPath, "utf8");
  const cleanedContent = rawContent.replace(/^\s*\[\]\s*/, "");
  const parsed = JSON.parse(cleanedContent);
  const filesTable = parsed.find(
    (entry) =>
      entry.type === "table" && (entry.name === "files" || entry.name === "files_backup"),
  );

  if (!filesTable || !filesTable.data) {
    throw new Error("Unable to find files backup data");
  }

  return filesTable.data;
}

main().catch((err) => {
  console.error("Failed to insert files from backup", err);
  process.exit(1);
});
