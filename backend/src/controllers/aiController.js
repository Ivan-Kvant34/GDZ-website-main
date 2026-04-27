const aiService = require('../services/aiService');
const ocrService = require('../services/ocrService');
const HttpError = require('../utils/httpError');

async function solve(req, res, next) {
  try {
    const taskText = req.body.taskText || '';
    const schoolStyle = req.body.schoolStyle || '';

    if (!taskText && !req.file) {
      throw new HttpError(400, 'Нужно отправить текст задания или фото.');
    }

    const photoText = req.file ? await ocrService.recognizeFromImage(req.file) : '';
    const solution = await aiService.solveTask({ taskText, schoolStyle, photoText });

    res.json({ solution, photoText });
  } catch (err) {
    next(err);
  }
}

async function explain(req, res, next) {
  try {
    const topic = (req.body.topic || '').trim();
    const level = Number(req.body.level || 7);

    if (!topic) {
      throw new HttpError(400, 'Укажите тему для объяснения.');
    }

    const explanation = await aiService.explainTopic({ topic, level });
    res.json({ explanation });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  solve,
  explain
};
