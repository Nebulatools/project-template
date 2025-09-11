import mysql from 'mysql2/promise'

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test_project_db',
      port: parseInt(process.env.DB_PORT || '3306')
    }
    
    console.log('Database config:', {
      ...config,
      password: '***'
    })
    
    connection = await mysql.createConnection(config)
  }
  return connection
}

export async function closeConnection() {
  if (connection) {
    await connection.end()
    connection = null
  }
}