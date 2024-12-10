const fs = require('fs');
const path = require('node:path');
const readline = require('readline');
const filePath = path.join(__dirname, './text.txt');
const writeStream = fs.createWriteStream(filePath, 'utf8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>>',
});

console.log('Type your text. Type "exit" to close the console');
rl.prompt();

rl.on('line', (line) => {
  if (line.trim().toLowerCase() === 'exit') {
    rl.close();
  } else {
    writeStream.write(`${line}\n`);
    rl.prompt();
  }
});

rl.on('close', () => {
  console.log('console closing');
  writeStream.end();
});
