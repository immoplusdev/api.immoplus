const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

console.log('🔍 Testing Direct Bucket Access...\n');

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

console.log('📋 Configuration:');
console.log(`  - Region: ${process.env.AWS_S3_REGION}`);
console.log(`  - Endpoint: ${process.env.AWS_S3_ENDPOINT}`);
console.log(`  - Bucket: ${bucketName}`);
console.log(`  - Force Path Style: ${process.env.AWS_S3_FORCE_PATH_STYLE}\n`);

async function testBucketAccess() {
  const testFileName = 'test-upload-' + Date.now() + '.txt';
  const testContent = 'Hello from ImmoPlus API - Test Upload';

  try {
    // Test 1: Upload a file
    console.log('✅ Test 1: Uploading test file...');
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: testFileName,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });

    await s3Client.send(putCommand);
    console.log(`✅ SUCCESS! File uploaded: ${testFileName}\n`);

    // Test 2: Generate presigned URL
    console.log('✅ Test 2: Generating presigned URL...');
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: testFileName,
    });

    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
    console.log(`✅ Presigned URL generated:\n   ${url}\n`);

    // Test 3: Delete test file
    console.log('✅ Test 3: Cleaning up test file...');
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: testFileName,
    });

    await s3Client.send(deleteCommand);
    console.log('✅ Test file deleted\n');

    console.log('🎉 All tests passed! Your DigitalOcean Space is working correctly!');

  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    console.log(`\nCode: ${error.Code || 'N/A'}`);
    console.log(`Status: ${error.$metadata?.httpStatusCode || 'N/A'}`);

    if (error.Code === 'NoSuchBucket') {
      console.log('\n⚠️  The bucket does not exist. Please check:');
      console.log(`   1. Bucket name is correct: "${bucketName}"`);
      console.log('   2. Bucket exists in your DigitalOcean Spaces console');
      console.log('   3. Bucket is in the correct region (ams3)');
    } else if (error.Code === 'AccessDenied') {
      console.log('\n⚠️  Access Denied. Please check:');
      console.log('   1. Access Key has proper permissions for this Space');
      console.log('   2. Access Key is enabled and not expired');
      console.log('   3. The Space allows access from your IP/location');
    } else {
      console.log('\nFull error:', error);
    }
  }
}

testBucketAccess();
