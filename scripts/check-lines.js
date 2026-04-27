const fs = require('fs');
const path = require('path');

const roots = ['backend', 'frontend', 'database', 'scripts', 'index.html', 'README.md'];

function countLinesInFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return text.split('\n').length;
}

function walk(targetPath) {
  const full = path.resolve(process.cwd(), targetPath);
  const stat = fs.statSync(full);
  if (stat.isFile()) {
    return [{ file: targetPath, lines: countLinesInFile(full) }];
  }

  const list = [];
  for (const entry of fs.readdirSync(full)) {
    const rel = path.join(targetPath, entry);
    const fullChild = path.resolve(process.cwd(), rel);
    const st = fs.statSync(fullChild);
    if (st.isDirectory()) {
      list.push(...walk(rel));
    } else if (st.isFile()) {
      list.push({ file: rel, lines: countLinesInFile(fullChild) });
    }
  }
  return list;
}

const files = roots.flatMap((r) => walk(r));
const total = files.reduce((acc, f) => acc + f.lines, 0);

console.log('Total lines:', total);
files.sort((a, b) => b.lines - a.lines).slice(0, 10).forEach((f) => {
  console.log(`${String(f.lines).padStart(6)}  ${f.file}`);
});

if (total < 10000) {
  process.exit(1);
}
