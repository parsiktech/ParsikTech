const { pool } = require('./config');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  console.log('Starting database seed...\n');

  try {
    // Check if admin user already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [process.env.ADMIN_EMAIL || 'admin@parsiktech.com']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists. Skipping seed.');
      return;
    }

    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@parsiktech.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const result = await pool.query(
      `INSERT INTO admin_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'super_admin')
       RETURNING id, email, name, role`,
      [adminEmail, passwordHash, adminName]
    );

    console.log('✓ Created admin user:');
    console.log(`  Email: ${result.rows[0].email}`);
    console.log(`  Name: ${result.rows[0].name}`);
    console.log(`  Role: ${result.rows[0].role}`);
    console.log('\n⚠️  IMPORTANT: Change the default password immediately after first login!\n');

  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
