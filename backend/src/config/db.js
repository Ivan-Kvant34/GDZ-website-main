const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.DB_URL
});

pool.on('error', (err) => {
  console.error('[DB] unexpected error', err);
});

async function query(text, params = []) {
  const started = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - started;
  if (duration > 250) {
    console.warn(`[DB] slow query ${duration}ms`, text.slice(0, 80));
  }
  return res;
}

module.exports = {
  pool,
  query
};
