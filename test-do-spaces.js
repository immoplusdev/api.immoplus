const { S3Client, ListBucketsCommand, CreateBucketCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

console.log('🔍 Testing DigitalOcean Spaces Configuration with AWS SDK...\n');

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
});

console.log('📋 Configuration:');
console.log(`  - Region: ${process.env.AWS_S3_REGION}`);
console.log(`  - Endpoint: ${process.env.AWS_S3_ENDPOINT}`);
console.log(`  - Bucket Name: ${process.env.AWS_S3_BUCKET_NAME}`);
console.log(`  - Force Path Style: ${process.env.AWS_S3_FORCE_PATH_STYLE}\n`);

async function testSpaces() {
  try {
    // Test 1: List all buckets
    console.log('✅ Test 1: Listing buckets...');
    const listCommand = new ListBucketsCommand({});
    const listResponse = await s3Client.send(listCommand);
    const buckets = listResponse.Buckets || [];
    console.log('   Buckets found:', buckets.map(b => b.Name).join(', ') || 'None');

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const bucketExists = buckets.some(b => b.Name === bucketName);

    if (!bucketExists) {
      console.log(`\n❌ ERROR: Bucket "${bucketName}" does not exist!`);
      console.log(`   Attempting to create bucket "${bucketName}"...\n`);

      try {
        const createCommand = new CreateBucketCommand({
          Bucket: bucketName,
        });
        await s3Client.send(createCommand);
        console.log(`✅ Bucket "${bucketName}" created successfully!\n`);
      } catch (createError) {
        console.log(`❌ Failed to create bucket: ${createError.message}`);
        console.log('   You may need to create the bucket manually in DigitalOcean Console.\n');
        return;
      }
    } else {
      console.log(`✅ Bucket "${bucketName}" exists!\n`);
    }

    // Test 2: Check bucket permissions
    console.log('✅ Test 2: Testing write permissions...');
    const testFileName = 'test-file-' + Date.now() + '.txt';
    const testContent = 'Test upload from ImmoPlus API';

    try {
      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: testFileName,
        Body: Buffer.from(testContent),
        ContentType: 'text/plain',
      });
      await s3Client.send(putCommand);
      console.log(`✅ Write permission OK! Test file uploaded: ${testFileName}\n`);

      // Clean up test file
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: testFileName,
      });
      await s3Client.send(deleteCommand);
      console.log(`✅ Test file deleted successfully\n`);

      console.log('🎉 All tests passed! DigitalOcean Spaces is configured correctly.');
    } catch (uploadError) {
      console.log(`❌ Write permission FAILED: ${uploadError.message}\n`);
      console.log('   Possible issues:');
      console.log('   1. Access Key does not have write permissions');
      console.log('   2. Bucket has restrictive ACL settings');
      console.log('   3. Access Key is not associated with this Space\n');
    }

  } catch (error) {
    console.log(`\n❌ Connection Error: ${error.message}`);
    console.log('\n   Possible issues:');
    console.log('   1. Invalid Access Key or Secret Key');
    console.log('   2. Network connectivity issues');
    console.log('   3. Incorrect endpoint or region');
    console.log('   4. CORS or network firewall blocking requests\n');
    console.log('Full error:', error);
  }
}

testSpaces();
