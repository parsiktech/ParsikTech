const { pool } = require('./config');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdminPassword() {
  console.log('Updating admin password...\n');

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@parsiktechgroup.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'Ninu1228';

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    const result = await pool.query(
      `UPDATE admin_users
       SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
       WHERE email = $2
       RETURNING id, email, name, role`,
      [passwordHash, adminEmail]
    );

    if (result.rows.length === 0) {
      console.log('Admin user not found. Creating new admin...');

      const adminName = process.env.ADMIN_NAME || 'Super Admin';
      const insertResult = await pool.query(
        `INSERT INTO admin_users (email, password_hash, name, role)
         VALUES ($1, $2, $3, 'super_admin')
         RETURNING id, email, name, role`,
        [adminEmail, passwordHash, adminName]
      );

      console.log('✓ Created admin user:');
      console.log(`  Email: ${insertResult.rows[0].email}`);
      console.log(`  Name: ${insertResult.rows[0].name}`);
    } else {
      console.log('✓ Updated admin password:');
      console.log(`  Email: ${result.rows[0].email}`);
      console.log(`  Name: ${result.rows[0].name}`);
    }

    console.log('\n✓ Password updated successfully!\n');

  } catch (err) {
    console.error('Failed to update password:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updateAdminPassword();
