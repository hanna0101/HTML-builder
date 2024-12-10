const fs = require('fs');
const path = require('node:path');
const filePath = path.join(__dirname, './text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', (data) => {
  process.stdout.write(data);
});

readStream.on('end', () => {
  process.stdout.write('reading complete');
});

readStream.on('error', (error) => {
  process.stdout.write(`error: ${error.message}`);
});
