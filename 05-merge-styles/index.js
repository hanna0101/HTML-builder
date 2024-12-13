const fs = require('fs');
const path = require('node:path');
const sourceFolder = path.join(__dirname, './styles');
const targetFolder = path.join(__dirname, './project-dist');
const BUNDLE_CSS = 'bundle.css';

const copyFolderWithAllData = () => {
  fs.mkdir(targetFolder, { recursive: true }, (error) => {
    const resultData = [];

    if (error) {
      console.log(error.message);
    }

    fs.readdir(sourceFolder, { withFileTypes: true }, (error, files) => {
      const filteredFiles = files.filter((file) => file.name.includes('css'));
      if (error) {
        console.log(error.message);
      } else {
        filteredFiles.forEach((file) => {
          let fileName = file.name;
          let pathToSourceFile = `${sourceFolder}/${fileName}`;
          const pathToTargetFile = `${targetFolder}/${BUNDLE_CSS}`;
          const numberFile = fileName.match(/\d+/)[0];

          const readStream = fs.createReadStream(pathToSourceFile, 'utf8');
          readStream.on('data', (data) => {
            resultData.push({ numberFile, data });

            if (resultData.length === filteredFiles.length) {
              const formattedResultDate = resultData
                .sort((a, b) => a.numberFile - b.numberFile)
                .map(({ data }) => data)
                .join('');
              const writeStream = fs.createWriteStream(
                pathToTargetFile,
                'utf8',
              );
              writeStream.write(formattedResultDate);
            }
          });
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

    if (!fileNames.includes(BUNDLE_CSS)) {
      copyFolderWithAllData();
    } else {
      deleteFolder(copyFolderWithAllData);
    }
  }
});
