const fs = require('fs');
const path = require('node:path');
const sourceFolder = path.join(__dirname, './files');
const targetFolder = path.join(__dirname, './files-copy');

const copyFileData = (source, target) => {
  const readStream = fs.createReadStream(source, 'utf8');
  const writeStream = fs.createWriteStream(target, 'utf8');
  readStream.on('data', (data) => {
    writeStream.write(`${data}`);
  });
};

const copyFolderWithAllData = () => {
  fs.mkdir(targetFolder, { recursive: true }, (error) => {
    if (error) {
      console.log(error.message);
    }

    fs.readdir(sourceFolder, { withFileTypes: true }, (error, files) => {
      if (error) {
        console.log(error.message);
      } else {
        files.forEach((file) => {
          let pathToTargetFile = `${targetFolder}/${file.name}`;
          let pathToSourceFile = `${sourceFolder}/${file.name}`;
          copyFileData(pathToSourceFile, pathToTargetFile);
        });
      }
    });
  });
};

const deleteFolder = (callback) => {
  fs.rmdir(targetFolder, { recursive: true }, () => {
    callback();
  });
};

fs.readdir(__dirname, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error.message);
  } else {
    const fileNames = files.map((file) => file.name);

    if (!fileNames.includes('files-copy')) {
      copyFolderWithAllData();
    } else {
      deleteFolder(copyFolderWithAllData);
    }
  }
});
