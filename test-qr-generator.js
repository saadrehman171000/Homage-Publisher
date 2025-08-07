const { Client } = require('pg');
const QRCode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL, // Your NeonDB connection string
  ssl: {
    rejectUnauthorized: false
  }
};

// Configuration
const BASE_URL = 'https://homagepublishers.com/product';
const QR_CODES_DIR = './qrcodes-test';
const MAX_TEST_PRODUCTS = 3; // Limit for testing

/**
 * Create a safe filename from product title
 */
function createSafeFilename(title, id) {
  const safeTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .substring(0, 50);
  
  if (safeTitle.length < 3) {
    return `product_${id}.png`;
  }
  
  return `${safeTitle}_${id.substring(0, 8)}.png`;
}

/**
 * Ensure the test directory exists
 */
async function ensureDirectoryExists() {
  try {
    await fs.access(QR_CODES_DIR);
    console.log(`✅ Test directory ${QR_CODES_DIR} already exists`);
  } catch (error) {
    console.log(`📁 Creating test directory ${QR_CODES_DIR}...`);
    await fs.mkdir(QR_CODES_DIR, { recursive: true });
    console.log(`✅ Test directory ${QR_CODES_DIR} created successfully`);
  }
}

/**
 * Generate QR code for a single product
 */
async function generateQRCodeForProduct(product) {
  try {
    const productUrl = `${BASE_URL}/${product.id}`;
    const filename = createSafeFilename(product.title, product.id);
    const filepath = path.join(QR_CODES_DIR, filename);
    
    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(productUrl, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Save to file
    await fs.writeFile(filepath, qrCodeBuffer);
    
    console.log(`✅ Generated QR code for "${product.title}"`);
    console.log(`   📄 File: ${filename}`);
    console.log(`   🔗 URL: ${productUrl}`);
    console.log(`   📁 Saved: ${filepath}`);
    console.log('');
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate QR code for "${product.title}":`, error.message);
    return false;
  }
}

/**
 * Test QR code generation with a few products
 */
async function testQRGeneration() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🧪 QR Code Generator - TEST MODE');
    console.log('═'.repeat(50));
    console.log('🔗 Connecting to NeonDB database...');
    await client.connect();
    console.log('✅ Connected to database successfully');
    
    // Ensure test output directory exists
    await ensureDirectoryExists();
    
    console.log(`📚 Fetching ${MAX_TEST_PRODUCTS} products for testing...`);
    const result = await client.query(`SELECT id, title FROM "Product" ORDER BY title LIMIT ${MAX_TEST_PRODUCTS}`);
    const products = result.rows;
    
    if (products.length === 0) {
      console.log('⚠️  No products found in the database');
      return;
    }
    
    console.log(`📖 Found ${products.length} products for testing:`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. "${product.title}"`);
    });
    console.log('');
    
    console.log('🚀 Starting QR code generation...');
    console.log('─'.repeat(50));
    
    let successCount = 0;
    
    // Generate QR codes for test products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`[${i + 1}/${products.length}] Processing: "${product.title}"`);
      
      const success = await generateQRCodeForProduct(product);
      if (success) {
        successCount++;
      }
    }
    
    console.log('═'.repeat(50));
    console.log('🎉 Test completed!');
    console.log(`✅ Successfully generated: ${successCount} QR codes`);
    console.log(`📁 Test QR codes saved in: ${path.resolve(QR_CODES_DIR)}`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Check the generated QR codes in the test folder');
    console.log('   2. Scan them with your phone to verify they work');
    console.log('   3. If satisfied, run: npm run generate-qr (for all products)');
    
  } catch (error) {
    console.error('💥 Error during test:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Database connection failed. Please check your DATABASE_URL environment variable.');
    } else if (error.code === '42P01') {
      console.error('📋 Table "Product" does not exist. Please verify your database schema.');
    }
  } finally {
    try {
      await client.end();
      console.log('🔌 Database connection closed');
    } catch (error) {
      console.error('⚠️  Error closing database connection:', error.message);
    }
  }
}

/**
 * Validate environment variables
 */
function validateEnvironment() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('💡 Set it like: export DATABASE_URL="your_neondb_connection_string"');
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  validateEnvironment();
  
  testQRGeneration()
    .then(() => {
      console.log('✨ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = {
  testQRGeneration,
  generateQRCodeForProduct
}; 