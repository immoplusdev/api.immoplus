# Migration from MinIO to AWS S3

This document describes the migration from MinIO to AWS S3 SDK for file storage.

## Changes Made

### 1. Dependencies
- **Added**: `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
- **Removed**: No longer using `minio` package

### 2. New Files Created
- `src/infrastructure/decorators/s3.decorator.ts` - S3 injection decorator
- `src/infrastructure/features/files/s3.module.ts` - S3 module configuration

### 3. Files Removed
- `src/infrastructure/features/files/minio.module.ts` - Old MinIO module
- `src/infrastructure/decorators/minio.decorator.ts` - Old MinIO decorator

### 4. Files Modified
- `src/infrastructure/features/files/file-service.ts` - Updated to use AWS S3 SDK
- `src/app.module.ts` - Changed from `MinioModule` to `S3Module`
- `src/infrastructure/decorators/index.ts` - Export S3 decorator instead of MinIO
- `src/infrastructure/features/files/index.ts` - Export S3 module instead of MinIO

## Environment Variables

### Old MinIO Configuration (No longer needed)
```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
```

### New AWS S3 Configuration (Required)
```env
# Required for AWS S3
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=your_access_key_id
AWS_S3_SECRET_ACCESS_KEY=your_secret_access_key

# Optional: For S3-compatible services (like MinIO in S3 compatibility mode)
# AWS_S3_ENDPOINT=http://localhost:9000
```

## API Changes

The `FilesService` API remains largely the same, but with the following improvements:

### Before (MinIO)
```typescript
constructor(@InjectMinio() private readonly minioService: Minio.Client) {}

// uploadFile returned a callback-based promise
uploadFile(file: MulterFile) {
  return new Promise((resolve, reject) => {
    this.minioService.putObject(..., (error, objInfo) => {
      // callback handling
    });
  });
}
```

### After (AWS S3)
```typescript
constructor(@InjectS3() private readonly s3Client: S3Client) {}

// uploadFile now uses async/await
async uploadFile(file: MulterFile) {
  const command = new PutObjectCommand({...});
  return await this.s3Client.send(command);
}
```

## Features

### Presigned URLs
- Presigned URLs are now generated with configurable expiration (default: 1 hour)
- Uses `@aws-sdk/s3-request-presigner` for secure URL generation

### Content Type Support
- File uploads now include proper `ContentType` metadata
- Better MIME type handling for uploaded files

### S3-Compatible Services
- The implementation supports S3-compatible services (like MinIO, LocalStack, etc.)
- Set `AWS_S3_ENDPOINT` environment variable to use with S3-compatible services
- `forcePathStyle: true` is automatically enabled when using a custom endpoint

## Migration Steps

1. **Install new dependencies** (already done):
   ```bash
   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
   ```

2. **Update environment variables**:
   - Copy `.env.example` values
   - Set `AWS_S3_REGION`, `AWS_S3_ACCESS_KEY_ID`, and `AWS_S3_SECRET_ACCESS_KEY`
   - Optionally set `AWS_S3_ENDPOINT` if using S3-compatible service

3. **Update Docker Compose** (if needed):
   - If you want to continue using MinIO locally in S3-compatible mode, update docker-compose.yml
   - Set `AWS_S3_ENDPOINT=http://localhost:9000` in your `.env` file

4. **Test the migration**:
   - Ensure the bucket "files" exists in your S3/MinIO instance
   - Test file upload and retrieval endpoints
   - Verify presigned URLs work correctly

## Backward Compatibility

If you need to temporarily support both MinIO and S3:
1. Keep both modules imported in `app.module.ts`
2. Create different service implementations
3. Use environment variables to switch between implementations

However, this migration completely removes MinIO support in favor of AWS S3.

## Troubleshooting

### Error: "Bucket does not exist"
- Ensure the "files" bucket exists in your S3 account
- Create it manually or update the bucket creation logic

### Error: "Access Denied"
- Verify your AWS credentials have proper permissions
- Check IAM policies for S3 access

### Error: "Invalid endpoint"
- If using S3-compatible service, ensure `AWS_S3_ENDPOINT` is set correctly
- Include protocol (http:// or https://)

### Connection timeout with S3-compatible services
- Verify the endpoint is accessible
- Check if `forcePathStyle: true` is needed (automatically set when endpoint is custom)
