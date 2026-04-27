const db = require('../config/db');

async function listFilters() {
  const countries = await db.query('SELECT DISTINCT country FROM textbooks ORDER BY country ASC');
  const grades = await db.query('SELECT DISTINCT grade FROM textbooks ORDER BY grade ASC');
  return {
    countries: countries.rows.map((r) => r.country),
    grades: grades.rows.map((r) => r.grade)
  };
}

async function searchBooks({ country, grade, subject }) {
  const conditions = [];
  const values = [];

  if (country) {
    values.push(country);
    conditions.push(`country = $${values.length}`);
  }
  if (grade) {
    values.push(Number(grade));
    conditions.push(`grade = $${values.length}`);
  }
  if (subject) {
    values.push(`%${subject.toLowerCase()}%`);
    conditions.push(`LOWER(subject) LIKE $${values.length}`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `
    SELECT id, country, grade, subject, title, author, publisher, year, language
    FROM textbooks
    ${whereSql}
    ORDER BY country ASC, grade ASC, subject ASC, title ASC
    LIMIT 200
  `;

  const result = await db.query(sql, values);
  return result.rows;
}

module.exports = {
  listFilters,
  searchBooks
};
