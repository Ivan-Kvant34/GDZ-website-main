export async function apiGet(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}`);
  }
  return response.json();
}

export async function apiPostForm(url, formData) {
  const response = await fetch(url, { method: 'POST', body: formData });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Ошибка ${response.status}`);
  }
  return response.json();
}

export async function apiPostJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Ошибка ${response.status}`);
  }
  return response.json();
}
