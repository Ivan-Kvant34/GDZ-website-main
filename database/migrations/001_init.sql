CREATE TABLE IF NOT EXISTS textbooks (
  id BIGSERIAL PRIMARY KEY,
  country VARCHAR(64) NOT NULL,
  grade INTEGER NOT NULL,
  subject VARCHAR(128) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  publisher VARCHAR(255),
  year INTEGER,
  language VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_textbooks_country_grade_subject ON textbooks(country, grade, subject);
CREATE INDEX IF NOT EXISTS idx_textbooks_subject ON textbooks(subject);
