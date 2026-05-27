import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Test NeonDB connection
pool.query('SELECT NOW()')
  .then(() => {
    console.log('NeonDB connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to NeonDB:', err.message);
  });

export default pool