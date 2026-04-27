const bookService = require('../services/bookService');

async function getFilters(req, res, next) {
  try {
    const data = await bookService.listFilters();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function searchBooks(req, res, next) {
  try {
    const data = await bookService.searchBooks(req.query);
    res.json({ items: data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFilters,
  searchBooks
};
