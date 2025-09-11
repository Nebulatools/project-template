import mysql from 'mysql2/promise'

export interface DatabaseConfig {
  host: string
  database: string
  username: string
  password: string
  port: number
}

export const dbConfig: DatabaseConfig = {
  host: process.env.NEXT_PUBLIC_HOSTNAME || '',
  database: process.env.NEXT_PUBLIC_DATABASE || '',
  username: process.env.NEXT_PUBLIC_USERNAME || '',
  password: process.env.NEXT_PUBLIC_PASSWORD || '',
  port: parseInt(process.env.NEXT_PUBLIC_PORT || '3306')
}

export async function createDatabaseConnection() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      port: dbConfig.port,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    return connection
  } catch (error) {
    console.error('Error creating database connection:', error)
    throw error
  }
}

export async function testDatabaseConnection(): Promise<{ 
  success: boolean, 
  message: string, 
  details?: any 
}> {
  try {
    console.log('Attempting to connect to MySQL database...')
    console.log('Config:', {
      host: dbConfig.host,
      database: dbConfig.database,
      username: dbConfig.username,
      port: dbConfig.port
    })
    
    const connection = await createDatabaseConnection()
    
    // Test the connection with a simple query
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution')
    
    // Test database access
    const [tables] = await connection.execute('SHOW TABLES')
    
    await connection.end()
    
    return {
      success: true,
      message: 'Database connection successful',
      details: {
        testQuery: rows,
        tablesCount: Array.isArray(tables) ? tables.length : 0,
        tables: tables
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Database connection failed:', error)
    
    return {
      success: false,
      message: `Database connection failed: ${errorMessage}`,
      details: {
        error: errorMessage,
        config: {
          host: dbConfig.host,
          database: dbConfig.database,
          username: dbConfig.username,
          port: dbConfig.port
        }
      }
    }
  }
}

export async function executeQuery(query: string, params?: any[]): Promise<any> {
  const connection = await createDatabaseConnection()
  try {
    const [results] = await connection.execute(query, params)
    return results
  } finally {
    await connection.end()
  }
}