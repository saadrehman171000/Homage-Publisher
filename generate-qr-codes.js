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
const QR_CODES_DIR = './qrcodes';

/**
 * Create a safe filename from product title
 * @param {string} title - Product title
 * @param {string} id - Product ID (as fallback)
 * @returns {string} Safe filename
 */
function createSafeFilename(title, id) {
  // Remove special characters and replace spaces with underscores
  const safeTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase()
    .substring(0, 50); // Limit length
  
  // If title becomes empty or too short, use ID
  if (safeTitle.length < 3) {
    return `product_${id}.png`;
  }
  
  return `${safeTitle}_${id.substring(0, 8)}.png`;
}

/**
 * Ensure the QR codes directory exists
 */
async function ensureDirectoryExists() {
  try {
    await fs.access(QR_CODES_DIR);
    console.log(`✅ Directory ${QR_CODES_DIR} already exists`);
  } catch (error) {
    console.log(`📁 Creating directory ${QR_CODES_DIR}...`);
    await fs.mkdir(QR_CODES_DIR, { recursive: true });
    console.log(`✅ Directory ${QR_CODES_DIR} created successfully`);
  }
}

/**
 * Generate QR code for a single product
 * @param {Object} product - Product object with id and title
 * @returns {Promise<boolean>} Success status
 */
async function generateQRCodeForBook(product) {
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
    
    console.log(`✅ Generated QR code for "${product.title}" -> ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate QR code for "${product.title}":`, error.message);
    return false;
  }
}

/**
 * Main function to generate QR codes for all books
 */
async function generateQRCodes() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔗 Connecting to NeonDB database...');
    await client.connect();
    console.log('✅ Connected to database successfully');
    
    // Ensure output directory exists
    await ensureDirectoryExists();
    
    console.log('📚 Fetching all products from database...');
    const result = await client.query('SELECT id, title FROM "Product" ORDER BY title');
    const products = result.rows;
    
    if (products.length === 0) {
      console.log('⚠️  No products found in the database');
      return;
    }
    
    console.log(`📖 Found ${products.length} products. Starting QR code generation...`);
    console.log('─'.repeat(60));
    
    let successCount = 0;
    let failureCount = 0;
    
    // Generate QR codes for all products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`[${i + 1}/${products.length}] Processing: "${product.title}"`);
      
      const success = await generateQRCodeForBook(product);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
      
      // Add small delay to avoid overwhelming the system
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('─'.repeat(60));
    console.log('🎉 QR code generation completed!');
    console.log(`✅ Successfully generated: ${successCount} QR codes`);
    if (failureCount > 0) {
      console.log(`❌ Failed: ${failureCount} QR codes`);
    }
    console.log(`📁 QR codes saved in: ${path.resolve(QR_CODES_DIR)}`);
    
  } catch (error) {
    console.error('💥 Error during execution:', error);
    
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

// Run the script
if (require.main === module) {
  validateEnvironment();
  
  console.log('🚀 Starting QR Code Generator for Homage Publishers');
  console.log('─'.repeat(60));
  
  generateQRCodes()
    .then(() => {
      console.log('✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = {
  generateQRCodes,
  createSafeFilename,
  generateQRCodeForBook
}; 