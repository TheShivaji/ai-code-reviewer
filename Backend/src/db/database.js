import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

// Test Database connection
pool.query('SELECT NOW()')
  .then(() => {
    const dbType = process.env.DATABASE_URL ? 'NeonDB' : 'Local Database';
    console.log(`${dbType} connected successfully`);
  })
  .catch((err) => {
    const dbType = process.env.DATABASE_URL ? 'NeonDB' : 'Local Database';
    console.error(`Error connecting to ${dbType}:`, err.message);
  });

export default pool