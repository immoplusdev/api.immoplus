const Minio = require('minio');
require('dotenv').config();

console.log('🔍 Testing DigitalOcean Spaces Configuration...\n');

const client = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  region: 'ams3',  // DigitalOcean Spaces region
});

console.log('📋 Configuration:');
console.log(`  - Endpoint: ${process.env.MINIO_ENDPOINT}`);
console.log(`  - Port: ${process.env.MINIO_PORT}`);
console.log(`  - SSL: ${process.env.MINIO_USE_SSL}`);
console.log(`  - Bucket: ${process.env.MINIO_BUCKET_NAME}`);
console.log(`  - Region: ams3\n`);

async function testSpaces() {
  try {
    // Test 1: List all buckets
    console.log('✅ Test 1: Listing buckets...');
    const buckets = await client.listBuckets();
    console.log('   Buckets found:', buckets.map(b => b.name).join(', ') || 'None');

    const bucketName = process.env.MINIO_BUCKET_NAME;
    const bucketExists = buckets.some(b => b.name === bucketName);

    if (!bucketExists) {
      console.log(`\n❌ ERROR: Bucket "${bucketName}" does not exist!`);
      console.log(`   Please create it in DigitalOcean Console → Spaces\n`);

      // Try to create the bucket
      console.log(`🔧 Attempting to create bucket "${bucketName}"...`);
      try {
        await client.makeBucket(bucketName, 'ams3');
        console.log(`✅ Bucket "${bucketName}" created successfully!\n`);
      } catch (createError) {
        console.log(`❌ Failed to create bucket: ${createError.message}\n`);
        console.log('   Please create the bucket manually in DigitalOcean Console.');
      }
    } else {
      console.log(`✅ Bucket "${bucketName}" exists!\n`);
    }

    // Test 2: Check bucket permissions
    console.log('✅ Test 2: Testing write permissions...');
    const testFileName = 'test-file-' + Date.now() + '.txt';
    const testContent = Buffer.from('Test upload from ImmoPlus API');

    try {
      await client.putObject(bucketName, testFileName, testContent);
      console.log(`✅ Write permission OK! Test file uploaded: ${testFileName}\n`);

      // Clean up test file
      await client.removeObject(bucketName, testFileName);
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
    console.log('   3. Incorrect endpoint or region\n');
    console.log('Full error:', error);
  }
}

testSpaces();
