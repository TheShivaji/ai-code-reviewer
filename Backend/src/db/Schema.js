import pool from "./database.js";

export const createTable = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(100) NOT NULL,
    bug_feedback TEXT,
    performance_feedback TEXT,
    best_practice_feedback TEXT,
    final_summary TEXT,
    score INT,
    share_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
        `);

        await pool.query(`
            ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score INT;
            ALTER TABLE reviews ADD COLUMN IF NOT EXISTS share_token VARCHAR(255);
            CREATE UNIQUE INDEX IF NOT EXISTS reviews_share_token_key ON reviews (share_token);
            ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source_type VARCHAR(50) DEFAULT 'paste';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS security_feedback TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS severity JSONB;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS fixed_code TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS pr_comment TEXT;
        `);

    } catch (error) {
        console.log(error);
    }
}