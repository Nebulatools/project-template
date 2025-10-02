const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getFrontendConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_HOSTNAME',
    'NEXT_PUBLIC_DATABASE',
    'NEXT_PUBLIC_USERNAME',
    'NEXT_PUBLIC_PASSWORD'
  ];

  const missing = requiredVars.filter((variable) => !process.env[variable]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    host: process.env.NEXT_PUBLIC_HOSTNAME,
    user: process.env.NEXT_PUBLIC_USERNAME,
    password: process.env.NEXT_PUBLIC_PASSWORD,
    database: process.env.NEXT_PUBLIC_DATABASE,
    port: parseInt(process.env.NEXT_PUBLIC_PORT || '3306', 10),
    ssl: {
      rejectUnauthorized: false
    }
  };
}

async function testConnection() {
  const config = getFrontendConfig();

  console.log('🔄 Testing MySQL database connection (frontend credentials)...');
  console.log('📋 Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Username: ${config.user}`);
  console.log(`   Port: ${config.port}`);
  console.log('');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection established successfully!');

    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('✅ Test query executed successfully:', rows[0]);

    const [dbInfo] = await connection.execute('SELECT DATABASE() AS current_db, VERSION() AS mysql_version');
    console.log('📊 Database info:', dbInfo[0]);

    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables in database:`);
    if (tables.length > 0) {
      tables.forEach((table) => console.log(`   - ${Object.values(table)[0]}`));
    } else {
      console.log('   (No tables found)');
    }

    await connection.end();
    console.log('✅ Connection closed successfully');
    console.log('');
    console.log('🎉 Frontend database connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    if (error.code) console.error('   Code:', error.code);
    if (error.sqlState) console.error('   State:', error.sqlState);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Verify the frontend connection parameters in .env');
    console.log('   2. Check if the database allows connections from public clients');
    console.log('   3. Confirm SSL requirements match your database configuration');
  }
}

testConnection().catch((error) => {
  console.error('Unexpected error running frontend connection test:', error);
  process.exitCode = 1;
});
