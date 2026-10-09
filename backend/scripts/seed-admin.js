/**
 * Seed script – creates (or updates) the demo admin account.
 *
 * Usage:
 *   node scripts/seed-admin.js
 *
 * Reads credentials from environment variables (or .env):
 *   SEED_ADMIN_NAME    – display name   (default: "Admin")
 *   SEED_ADMIN_EMAIL   – login email    (default: "admin@college.edu")
 *   SEED_ADMIN_PASSWORD– plain password (default: "Admin@1234")
 *
 * To change the admin password later just re-run this script with the new
 * SEED_ADMIN_PASSWORD value – the row will be upserted.
 *
 * NEVER commit real credentials to source control.
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool   = require('../db/pool');

(async () => {
  const name     = process.env.SEED_ADMIN_NAME     || 'Admin';
  const email    = process.env.SEED_ADMIN_EMAIL    || 'admin@college.edu';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';

  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE
       name     = VALUES(name),
       password = VALUES(password),
       role     = VALUES(role)`,
    [name, email, hash]
  );

  console.log(`✅  Admin account seeded for: ${email}`);
  console.log('    Password is stored as a bcrypt hash – never in plain text.');
  process.exit(0);
})().catch(err => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
