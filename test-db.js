import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const checkConnection = async () => {
    console.log("Testing connection with URL from .env...");
    console.log("URL:", process.env.DATABASE_URL);

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL.replace(/['"]/g, ''), // Strip quotes if present
    });

    try {
        const client = await pool.connect();
        console.log("Successfully connected to the database!");
        const res = await client.query('SELECT NOW()');
        console.log('Current Time from DB:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error("Connection Error:", err.message);
        console.error("Full Error:", err);
    } finally {
        await pool.end();
    }
};

checkConnection();
