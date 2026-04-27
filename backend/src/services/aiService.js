const OpenAI = require('openai');
const env = require('../config/env');

let client = null;
if (env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

function localFallback(promptType, payload) {
  if (promptType === 'solve') {
    return [
      'Демо-режим: API ключ не указан.',
      '1) Прочитайте условие и выпишите известные данные.',
      '2) Определите формулу/правило по теме.',
      '3) Выполните вычисления по шагам.',
      '4) Проверьте ответ подстановкой.',
      `Школьный стиль: ${payload.schoolStyle || 'не указан'}`
    ].join('\n');
  }

  return [
    'Демо-режим: API ключ не указан.',
    `Тема: ${payload.topic}`,
    `Уровень: ${payload.level} класс`,
    'Объяснение: начните с интуитивного примера, затем правило, затем 2 коротких упражнения.'
  ].join('\n');
}

async function askModel(system, user) {
  if (!client) {
    return null;
  }

  const response = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.3
  });

  return response.output_text;
}

async function solveTask(payload) {
  const systemPrompt =
    'Ты педагог-методист. Пиши решение пошагово, безопасно и понятно для школьника. Без токсичности.';
  const userPrompt = [
    `Задание: ${payload.taskText || 'текст не указан'}`,
    `Как объясняли в школе: ${payload.schoolStyle || 'не указано'}`,
    payload.photoText ? `Распознанный текст с фото: ${payload.photoText}` : ''
  ]
    .filter(Boolean)
    .join('\n');

  const answer = await askModel(systemPrompt, userPrompt);
  return answer || localFallback('solve', payload);
}

async function explainTopic(payload) {
  const systemPrompt =
    'Ты дружелюбный школьный преподаватель. Объясняй простыми словами, короткими абзацами, добавляй примеры.';
  const userPrompt = `Объясни тему "${payload.topic}" для ${payload.level} класса. Добавь 2 примера и мини-проверку.`;

  const answer = await askModel(systemPrompt, userPrompt);
  return answer || localFallback('explain', payload);
}

module.exports = {
  solveTask,
  explainTopic
};
