const express = require('express');
const cors = require('cors');
const path = require('path');

const bookRoutes = require('./routes/bookRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/frontend', express.static(path.resolve(process.cwd(), 'frontend')));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'gdz-ai', timestamp: new Date().toISOString() });
});

app.use('/api/books', bookRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

module.exports = app;
