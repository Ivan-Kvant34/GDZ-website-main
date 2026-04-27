import { apiGet, apiPostForm, apiPostJson } from './api.js';

const countryFilter = document.querySelector('#countryFilter');
const gradeFilter = document.querySelector('#gradeFilter');
const subjectFilter = document.querySelector('#subjectFilter');
const loadBooksBtn = document.querySelector('#loadBooksBtn');
const booksGrid = document.querySelector('#booksGrid');

const solveForm = document.querySelector('#solveForm');
const solveResult = document.querySelector('#solveResult');

const explainForm = document.querySelector('#explainForm');
const explainResult = document.querySelector('#explainResult');

function fillSelect(element, values, allLabel) {
  element.innerHTML = '';
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = allLabel;
  element.appendChild(allOption);

  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = String(value);
    element.appendChild(option);
  });
}

async function loadFilters() {
  try {
    const data = await apiGet('/api/books/filters');
    fillSelect(countryFilter, data.countries, 'Все страны');
    fillSelect(gradeFilter, data.grades, 'Все классы');
  } catch (err) {
    booksGrid.innerHTML = `<div class="book-item">Ошибка загрузки фильтров: ${err.message}</div>`;
  }
}

function renderBooks(items) {
  booksGrid.innerHTML = '';
  if (!items.length) {
    booksGrid.innerHTML = '<div class="book-item">Ничего не найдено</div>';
    return;
  }

  items.forEach((book) => {
    const div = document.createElement('div');
    div.className = 'book-item';
    div.innerHTML = `
      <strong>${book.title}</strong>
      <div>${book.subject}, ${book.grade} класс</div>
      <div>${book.country} · ${book.language}</div>
      <div>${book.author || 'Автор не указан'}</div>
      <small>${book.publisher || '-'}, ${book.year || '-'}</small>
    `;
    booksGrid.appendChild(div);
  });
}

async function loadBooks() {
  const params = new URLSearchParams();
  if (countryFilter.value) params.set('country', countryFilter.value);
  if (gradeFilter.value) params.set('grade', gradeFilter.value);
  if (subjectFilter.value.trim()) params.set('subject', subjectFilter.value.trim());

  try {
    const data = await apiGet(`/api/books/search?${params.toString()}`);
    renderBooks(data.items);
  } catch (err) {
    booksGrid.innerHTML = `<div class="book-item">Ошибка поиска: ${err.message}</div>`;
  }
}

solveForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  solveResult.textContent = 'Готовим решение...';

  const formData = new FormData();
  formData.set('schoolStyle', document.querySelector('#schoolStyle').value);
  formData.set('taskText', document.querySelector('#taskText').value);
  const file = document.querySelector('#taskPhoto').files[0];
  if (file) formData.set('taskPhoto', file);

  try {
    const data = await apiPostForm('/api/ai/solve', formData);
    solveResult.textContent = `${data.solution}\n\n---\n${data.photoText || ''}`;
  } catch (err) {
    solveResult.textContent = `Ошибка: ${err.message}`;
  }
});

explainForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  explainResult.textContent = 'Подготавливаем объяснение...';

  try {
    const data = await apiPostJson('/api/ai/explain', {
      topic: document.querySelector('#explainTopic').value,
      level: document.querySelector('#explainLevel').value
    });
    explainResult.textContent = data.explanation;
  } catch (err) {
    explainResult.textContent = `Ошибка: ${err.message}`;
  }
});

loadBooksBtn.addEventListener('click', loadBooks);

await loadFilters();
await loadBooks();
