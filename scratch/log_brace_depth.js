const fs = require('fs');
const content = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');

let braceCount = 0;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let cleanLine = line.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '').replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, '').replace(/`[^`\\]*(?:\\.[^`\\]*)*`/g, '');
  
  for (let char of cleanLine) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
  }
  
  if (braceCount === 0) {
    console.log(`Line ${i + 1} (depth 0): ${line.trim().substring(0, 50)}`);
  }
}
console.log('Done.');
