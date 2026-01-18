const fs = require('fs');
const path = require('path');
const { pool } = require('./config');
require('dotenv').config();

const migrationsDir = path.join(__dirname, 'migrations');

async function createMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations() {
  const result = await pool.query('SELECT name FROM migrations ORDER BY id');
  return result.rows.map(row => row.name);
}

async function runMigrations() {
  console.log('Starting Supabase database migrations...\n');

  try {
    await createMigrationsTable();
    const executedMigrations = await getExecutedMigrations();

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    let migrationsRun = 0;

    for (const file of migrationFiles) {
      if (!executedMigrations.includes(file)) {
        console.log(`Running migration: ${file}`);

        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        await pool.query('BEGIN');
        try {
          await pool.query(sql);
          await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await pool.query('COMMIT');
          console.log(`  ✓ ${file} completed\n`);
          migrationsRun++;
        } catch (err) {
          await pool.query('ROLLBACK');
          console.error(`  ✗ ${file} failed:`, err.message);
          throw err;
        }
      }
    }

    if (migrationsRun === 0) {
      console.log('No new migrations to run.');
    } else {
      console.log(`\n${migrationsRun} migration(s) completed successfully.`);
    }
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function rollbackMigration() {
  console.log('Rolling back last migration...\n');

  try {
    await createMigrationsTable();

    const result = await pool.query(
      'SELECT name FROM migrations ORDER BY id DESC LIMIT 1'
    );

    if (result.rows.length === 0) {
      console.log('No migrations to rollback.');
      return;
    }

    const lastMigration = result.rows[0].name;
    console.log(`Rolling back: ${lastMigration}`);

    // Note: This is a simple rollback that just removes the migration record
    // For production, you should have separate down migrations
    await pool.query('DELETE FROM migrations WHERE name = $1', [lastMigration]);
    console.log(`  ✓ Removed migration record for ${lastMigration}`);
    console.log('\nNote: Database schema changes were NOT reverted.');
    console.log('You may need to manually revert schema changes.');
  } catch (err) {
    console.error('Rollback failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Check command line argument
const command = process.argv[2];

if (command === 'down') {
  rollbackMigration();
} else {
  runMigrations();
}
