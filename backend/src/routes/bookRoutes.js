const express = require('express');
const controller = require('../controllers/bookController');

const router = express.Router();

router.get('/filters', controller.getFilters);
router.get('/search', controller.searchBooks);

module.exports = router;
