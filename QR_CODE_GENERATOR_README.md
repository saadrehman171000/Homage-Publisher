# QR Code Generator for Homage Publishers

This script generates QR codes for all products in your NeonDB PostgreSQL database, creating product page URLs for each book/product.

## 📋 Prerequisites

- Node.js (v14 or higher)
- Access to NeonDB PostgreSQL database
- Database with a `Product` table containing `id` and `title` columns (matches your existing schema)

## 🚀 Quick Start

### 1. Install Dependencies

The required dependencies (`pg` and `qrcode`) have been added to your main `package.json`. Install them by running:

```bash
npm install
```

### 2. Set Environment Variables

Set your NeonDB connection string as an environment variable:

```bash
# Option 1: Export in your terminal
export DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Option 2: Create a .env file (already exists in your project)
echo 'DATABASE_URL="your_neondb_connection_string"' >> .env
```

### 3. Run the Script

```bash
# Using npm script
npm run generate-qr

# Or directly with node
node generate-qr-codes.js
```

## 📁 Output

- QR codes are saved as PNG files in the `./qrcodes/` directory
- Directory is created automatically if it doesn't exist
- Files are named safely based on product titles: `product_title_12345678.png`
- Each QR code links to: `https://homagepublishers.com/product/{product_id}`

## 🔧 Configuration

You can modify these settings in `generate-qr-codes.js`:

```javascript
const BASE_URL = 'https://homagepublishers.com/product'; // Change base URL
const QR_CODES_DIR = './qrcodes'; // Change output directory

// QR code options
const qrOptions = {
  type: 'png',
  width: 300,      // Size in pixels
  margin: 2,       // Margin around QR code
  color: {
    dark: '#000000',   // QR code color
    light: '#FFFFFF'   // Background color
  }
};
```

## 📊 Database Schema

The script works with your existing `Product` table:

```sql
-- Your existing Prisma schema (from prisma/schema.prisma)
model Product {
  id          String   @id @default(uuid())
  title       String
  description String
  price       Float
  -- other columns...
}
```

The script only needs the `id` and `title` fields from your Product table.

## 🛠️ Features

- ✅ **Safe Filenames**: Automatically creates safe filenames from product titles
- ✅ **Error Handling**: Continues processing even if individual products fail
- ✅ **Progress Tracking**: Shows progress for each product
- ✅ **Database Connection**: Secure SSL connection to NeonDB
- ✅ **Directory Creation**: Automatically creates output directory
- ✅ **Batch Processing**: Processes all products with rate limiting

## 📝 Example Output

```
🚀 Starting QR Code Generator for Homage Publishers
────────────────────────────────────────────────────────────
🔗 Connecting to NeonDB database...
✅ Connected to database successfully
📁 Creating directory ./qrcodes...
✅ Directory ./qrcodes created successfully
📚 Fetching all products from database...
📖 Found 25 products. Starting QR code generation...
────────────────────────────────────────────────────────────
[1/25] Processing: "English Grammar Grade 1"
✅ Generated QR code for "English Grammar Grade 1" -> english_grammar_grade_1_a1b2c3d4.png
[2/25] Processing: "Mathematics Workbook Grade 2"
✅ Generated QR code for "Mathematics Workbook Grade 2" -> mathematics_workbook_grade_2_e5f6g7h8.png
...
────────────────────────────────────────────────────────────
🎉 QR code generation completed!
✅ Successfully generated: 25 QR codes
📁 QR codes saved in: /path/to/your/project/qrcodes
✨ Script completed successfully
```

## 🔍 Troubleshooting

### Database Connection Issues
```bash
❌ DATABASE_URL environment variable is required
💡 Set it like: export DATABASE_URL="your_neondb_connection_string"
```

### Table Not Found
```bash
📋 Table "Product" does not exist. Please verify your database schema.
```

### Permission Issues
```bash
💥 Error: EACCES: permission denied, mkdir './qrcodes'
```
Solution: Check folder permissions or run with appropriate privileges.

## 💡 Usage Tips

1. **Backup First**: Run a test with a few products before processing your entire database
2. **Verify URLs**: Test a few generated QR codes to ensure they point to the correct product pages
3. **Clean Output**: Delete the `qrcodes` folder if you want to regenerate all QR codes
4. **Monitor Progress**: Watch the console output for any failed generations

## 🏗️ Integration

You can integrate this script into your deployment pipeline:

```bash
# Add to your deployment scripts
npm run generate-qr

# Or run periodically for new products
crontab -e
# Add: 0 2 * * * cd /path/to/project && npm run generate-qr
```

---

**Need help?** Check the console output for detailed error messages and troubleshooting tips. 