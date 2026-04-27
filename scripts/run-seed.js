const fs = require('fs');
const path = require('path');
const db = require('../backend/src/config/db');

(async () => {
  const filePath = path.resolve(process.cwd(), 'database/seeds/001_textbooks_seed.sql');
  const sql = fs.readFileSync(filePath, 'utf8');
  await db.query(sql);
  console.log('Seed complete:', filePath);
  await db.pool.end();
})();
