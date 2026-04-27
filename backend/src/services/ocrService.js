async function recognizeFromImage(file) {
  if (!file) {
    return '';
  }

  return `Распознавание (демо): файл ${file.originalname}, размер ${file.size} байт`;
}

module.exports = {
  recognizeFromImage
};
