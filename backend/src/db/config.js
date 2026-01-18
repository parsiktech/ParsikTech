const { Pool } = require('pg');
require('dotenv').config();

// Supabase connection configuration
// Use the connection string from Supabase Dashboard > Settings > Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased for remote connection
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to Supabase PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Verify connection on startup
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✓ Supabase database connection verified');
    client.release();
  } catch (err) {
    console.error('✗ Failed to connect to Supabase:', err.message);
  }
};

testConnection();

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
