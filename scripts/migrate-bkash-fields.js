// scripts/migrate-bkash-fields.js
// Run with: node scripts/migrate-bkash-fields.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Update with your database connection details
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log
  }
);

async function migrate() {
  try {
    console.log('🔄 Starting migration...');
    
    // Add bkash_number column
    console.log('Adding bkash_number column...');
    await sequelize.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS bkash_number VARCHAR(20);
    `);
    
    // Add bkash_transaction_id column
    console.log('Adding bkash_transaction_id column...');
    await sequelize.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS bkash_transaction_id VARCHAR(100);
    `);
    
    // Make customer_email nullable
    console.log('Making customer_email nullable...');
    await sequelize.query(`
      ALTER TABLE orders 
      ALTER COLUMN customer_email DROP NOT NULL;
    `);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND column_name IN ('bkash_number', 'bkash_transaction_id', 'customer_email');
    `);
    
    console.log('\n📊 Column verification:');
    console.table(results);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();