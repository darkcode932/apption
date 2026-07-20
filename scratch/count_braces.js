const fs = require('fs');
const content = fs.readFileSync('src/app/(authenticated)/launch-petition/page.tsx', 'utf8');

let braceCount = 0;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  // Remove string literals to avoid counting braces inside strings
  let cleanLine = line.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '').replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, '').replace(/`[^`\\]*(?:\\.[^`\\]*)*`/g, '');
  
  // Count braces
  for (let char of cleanLine) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
  }
  
  if (braceCount < 0) {
    console.log(`Line ${i + 1} has too many closing braces! count: ${braceCount}`);
    console.log(`Content: ${line}`);
    break;
  }
}
console.log('Final brace count:', braceCount);
