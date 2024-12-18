const fs = require('fs');
const path = require('node:path');
const targetFolder = path.join(__dirname, './project-dist');
const sourceCSS = path.join(__dirname, './styles');
const targetCSS = `${targetFolder}/style.css`;
const sourceASSETS = path.join(__dirname, './assets');
const targetFolderASSETS = `${targetFolder}/assets/`;
const sourceHTML = path.join(__dirname, './template.html');
const targetHTML = `${targetFolder}/index.html`;
const sourceComponents = path.join(__dirname, './components');

const copyCSS = () => {
  const resultData = [];
  fs.mkdir(targetFolder, { recursive: true }, (error) => {
    if (error) {
      console.log(error.message);
    }

    fs.readdir(sourceCSS, { withFileTypes: true }, (error, files) => {
      const filteredFiles = files.filter((file) => file.name.includes('css'));
      if (error) {
        console.log(error.message);
      } else {
        filteredFiles.forEach((file) => {
          let fileName = file.name;
          let pathToSourceFileCSS = `${sourceCSS}/${fileName}`;
          const pathToTargetFileCSS = `${targetCSS}`;
          const numberFile = fileName.match(/\d+/)[0];

          const readStream = fs.createReadStream(pathToSourceFileCSS);
          readStream.on('data', (data) => {
            resultData.push({ numberFile, data });

            if (resultData.length === filteredFiles.length) {
              const formattedResultDate = resultData
                .sort((a, b) => a.numberFile - b.numberFile)
                .map(({ data }) => data)
                .join('');
              const writeStream = fs.createWriteStream(pathToTargetFileCSS);
              writeStream.write(formattedResultDate);
            }
          });
        });
      }
    });
  });
};

const copyASSETS = () => {
  fs.readdir(sourceASSETS, { withFileTypes: true }, (error, folders) => {
    if (error) {
      console.log(error.message);
    } else {
      folders.forEach((folder) => {
        if (folder.isDirectory()) {
          const pathToTargetFolderASSETS = `${targetFolderASSETS}${folder.name}`;

          fs.mkdir(pathToTargetFolderASSETS, { recursive: true }, (error) => {
            if (error) {
              console.log(error.message);
            }

            fs.readdir(
              `${sourceASSETS}/${folder.name}`,
              { withFileTypes: true },
              (error, files) => {
                if (error) {
                  console.log(error.message);
                } else {
                  files.forEach((file) => {
                    const pathToSourceFileASSETS = `${sourceASSETS}/${folder.name}/${file.name}`;
                    const pathToTargetFileASSETS = `${pathToTargetFolderASSETS}/${file.name}`;

                    const readStream = fs.createReadStream(
                      pathToSourceFileASSETS,
                    );
                    const writeStream = fs.createWriteStream(
                      pathToTargetFileASSETS,
                    );

                    readStream.on('data', (data) => {
                      writeStream.write(data);
                    });
                  });
                }
              },
            );
          });
        }
      });
    }
  });
};

const copyHTML = () => {
  let COMPONENTS = {};

  fs.mkdir(targetFolder, { recursive: true }, (error) => {
    const readStreamTemplate = fs.createReadStream(sourceHTML, 'utf8');
    const writeStreamTemplate = fs.createWriteStream(targetHTML);

    if (error) {
      console.log(error.message);
    }

    fs.readdir(sourceComponents, { withFileTypes: true }, (error, files) => {
      if (error) {
        console.log(error.message);
      } else {
        files.forEach((file) => {
          const pathToSourceFileComponents = `${sourceComponents}/${file.name}`;

          const readStream = fs.createReadStream(
            pathToSourceFileComponents,
            'utf8',
          );

          readStream.on('data', (data) => {
            COMPONENTS[file.name] = data;
            if (Object.keys(COMPONENTS).length === files.length) {
              readStreamTemplate.on('data', (data) => {
                data = data
                  .replace('{{header}}', COMPONENTS['header.html'])
                  .replace('{{articles}}', COMPONENTS['articles.html'])
                  .replace('{{footer}}', COMPONENTS['footer.html']);
                writeStreamTemplate.write(data);
              });
            }
          });
        });
      }
    });
  });
};
const copyFolderWithAllData = () => {
  copyCSS();
  copyASSETS();
  copyHTML();
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

    if (!fileNames.includes('project-dist')) {
      copyFolderWithAllData();
    } else {
      deleteFolder(copyFolderWithAllData);
    }
  }
});
