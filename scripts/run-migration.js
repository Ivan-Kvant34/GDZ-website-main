const fs = require('fs');
const path = require('path');
const db = require('../backend/src/config/db');

(async () => {
  const filePath = path.resolve(process.cwd(), 'database/migrations/001_init.sql');
  const sql = fs.readFileSync(filePath, 'utf8');
  await db.query(sql);
  console.log('Migration complete:', filePath);
  await db.pool.end();
})();
