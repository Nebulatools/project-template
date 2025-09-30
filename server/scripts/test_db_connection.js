const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function testConnection() {
  const config = {
    host: process.env.NEXT_PUBLIC_HOSTNAME,
    user: process.env.NEXT_PUBLIC_USERNAME,
    password: process.env.NEXT_PUBLIC_PASSWORD,
    database: process.env.NEXT_PUBLIC_DATABASE,
    port: parseInt(process.env.NEXT_PUBLIC_PORT || '3306'),
    ssl: {
      rejectUnauthorized: false
    }
  };

  console.log('🔄 Testing MySQL database connection...');
  console.log('📋 Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Username: ${config.user}`);
  console.log(`   Port: ${config.port}`);
  console.log('');

  try {
    // Create connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection established successfully!');

    // Test with simple query
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('✅ Test query executed successfully:', rows[0]);

    // Get database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() AS current_db, VERSION() AS mysql_version');
    console.log('📊 Database info:', dbInfo[0]);

    // List tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables in database:`);
    if (tables.length > 0) {
      tables.forEach(table => console.log(`   - ${Object.values(table)[0]}`));
    } else {
      console.log('   (No tables found)');
    }

    // Close connection
    await connection.end();
    console.log('✅ Connection closed successfully');
    console.log('');
    console.log('🎉 Database connection test completed successfully!');
    console.log('🔗 You can now use this database in your Next.js application');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   State:', error.sqlState);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Check if the database server is running');
    console.log('   2. Verify the connection parameters in .env');
    console.log('   3. Check if the database allows remote connections');
    console.log('   4. Verify firewall settings');
    console.log('   5. Check SSL/TLS configuration');
  }
}

testConnection();