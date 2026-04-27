const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/gdz_ai',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
