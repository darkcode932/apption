const fs = require('fs');
const content = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 78; i < 86 && i < lines.length; i++) {
  const line = lines[i];
  console.log(`Line ${i + 1}: [${line}]`);
  const codes = [];
  for (let j = 0; j < line.length; j++) {
    codes.push(line.charCodeAt(j));
  }
  console.log(`Codes: ${codes.join(', ')}`);
}
