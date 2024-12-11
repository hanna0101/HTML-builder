const fs = require('fs');
const path = require('node:path');
const filePath = path.join(__dirname, './secret-folder');

fs.readdir(filePath, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error.message);
  } else {
    files.forEach((file) => {
      let isFile = file.isFile();
      if (isFile) {
        let pathToFile = `${filePath}/${file.name}`;

        fs.stat(pathToFile, (error, stats) => {
          let fileName = file.name.split('.')[0];
          let fileExtension = path.extname(file.name).split('.')[1];
          const fileSizeInBytes = stats.size;
          const fileSizeInKB = fileSizeInBytes / 1024;

          if (error) {
            console.log(error.message);
          } else {
            console.log(
              `${fileName}-${fileExtension}-${fileSizeInKB.toFixed(3)}kb`,
            );
          }
        });
      }
    });
  }
});
