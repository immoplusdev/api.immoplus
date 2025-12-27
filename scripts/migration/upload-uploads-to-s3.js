const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const dotenv = require("dotenv");

const rootDir = path.resolve(__dirname, "..", "..");
dotenv.config({ path: path.join(rootDir, ".env") });

const uploadsDir = path.join(rootDir, "uploads");
const filesJsonPath = path.join(rootDir, "scripts", "migration", "files.json");

const requiredEnv = [
    "AWS_S3_REGION",
    "AWS_S3_ACCESS_KEY_ID",
    "AWS_S3_SECRET_ACCESS_KEY",
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`);
    }
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || "files";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    ...(process.env.AWS_S3_ENDPOINT
        ? {
            endpoint: process.env.AWS_S3_ENDPOINT,
            forcePathStyle:
                (process.env.AWS_S3_FORCE_PATH_STYLE || "false").toLowerCase() ===
                "true",
        }
        : {}),
});

const MIME_MAP = {
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".svg": "image/svg+xml",
    ".heic": "image/heic",
    ".mov": "video/quicktime",
    ".mp4": "video/mp4",
    ".m4v": "video/x-m4v",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
    ".webm": "video/webm",
    ".pdf": "application/pdf",
};

function guessContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    return MIME_MAP[ext] || "application/octet-stream";
}

function formatTimestamp(date = new Date()) {
    return date.toISOString().replace("T", " ").replace("Z", "");
}

async function loadFilesExport() {
    const raw = await fs.readFile(filesJsonPath, "utf8");
    const parsed = JSON.parse(raw);
    const filesTable = parsed.find(
        (entry) => entry.type === "table" && entry.name === "files",
    );

    if (!filesTable || !Array.isArray(filesTable.data)) {
        throw new Error("Could not find files table in files.json");
    }

    return { exportJson: parsed, filesTable };
}

async function uploadToS3(filePath, key, contentType, size) {
    const body = await fs.readFile(filePath);
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: size,
    });

    await s3Client.send(command);
}

async function main() {
    const uploads = await fs.readdir(uploadsDir);
    if (!uploads.length) {
        console.log("No files found in uploads directory.");
        return;
    }

    const { exportJson, filesTable } = await loadFilesExport();

    const recordsByDownload = new Map(
        filesTable.data
            .filter((row) => row.filename_download)
            .map((row) => [row.filename_download, row]),
    );

    const recordsByDisk = new Map(
        filesTable.data.map((row) => [row.filename_disk, row]),
    );

    for (const fileName of uploads) {
        const filePath = path.join(uploadsDir, fileName);
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) {
            continue;
        }

        const contentType = guessContentType(fileName);
        const newExternalId = randomUUID();

        await uploadToS3(filePath, newExternalId, contentType, stats.size);

        const existing =
            recordsByDownload.get(fileName) || recordsByDisk.get(fileName);

        if (existing) {
            existing.external_file_id = newExternalId;
            existing.modified_on = formatTimestamp();
            if (!existing.filesize) {
                existing.filesize = stats.size;
            }
            if (!existing.filename_download) {
                existing.filename_download = fileName;
            }
            existing.storage = existing.storage || "minio";
            existing.type = existing.type || contentType;
            console.log(
                `Updated existing record for ${fileName} with external_file_id ${newExternalId}`,
            );
        } else {
            const now = formatTimestamp();
            const newRow = {
                id: randomUUID(),
                filename_disk: fileName,
                filename_download: fileName,
                storage: "minio",
                type: contentType,
                folder: null,
                uploaded_on: now,
                modified_on: now,
                deleted_on: null,
                title: null,
                charset: null,
                filesize: stats.size,
                width: null,
                height: null,
                duration: null,
                embed: null,
                description: null,
                location: null,
                tags: null,
                metadata: null,
                focal_point_x: null,
                focal_point_y: null,
                tus_id: null,
                tus_data: null,
                uploaded_by: null,
                modified_by: null,
                external_file_id: newExternalId,
            };

            filesTable.data.push(newRow);
            console.log(
                `Added new record for ${fileName} with external_file_id ${newExternalId}`,
            );
        }
    }

    await fs.writeFile(filesJsonPath, JSON.stringify(exportJson, null, 4));
    console.log(`files.json updated at ${filesJsonPath}`);
}

main().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});
