const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const fsPromises = fs.promises;

//
// checksumFile -- generates a hash to validate on the arduino client
//
const getHashForFile = (algorithm, filePath) =>
  new Promise((resolve, reject) =>
    fs
      .createReadStream(filePath)
      .on('error', reject)
      .pipe(crypto.createHash(algorithm).setEncoding('hex'))
      .once('finish', function() {
        resolve(this.read());
      })
  );

//
// getFileInfo
//
const getFileInfo = async version => {
  // Find the file
  const directoryPath = path.join(__dirname, `/bin/${version}`);
  const files = await fsPromises.readdir(directoryPath);
  const fileName = files.filter(currentFile => currentFile.includes('.bin'))[0];

  // Get string to file path
  const filePath = path.join(directoryPath, fileName);

  // Read the file to Base64 buffer
  const fileData = await fsPromises.readFile(filePath);

  // Convert buffer to Base64 string
  // const fileData = fileBuffer.toString('binary');
  // Read file meta data and add file name to the fileMeta
  const fileMeta = await fsPromises.stat(filePath);
  fileMeta.name = fileName;

  /// Make the hash

  fileMeta.sha256 = await getHashForFile('sha256', filePath);

  return { fileMeta, fileData };
};

//
// getMeta
//

const getMeta = async version => {
  const { fileMeta } = await getFileInfo(version);
  const returnValue = `name: ${fileMeta.name}
size: ${fileMeta.size}
sequence: ${fileMeta.mtimeMs}
sha256: ${fileMeta.sha256}`;

  return returnValue;
};

//
// getData
//

const getData = async version => {
  const { fileData } = await getFileInfo(version);
  return fileData;
};

module.exports = { getMeta, getData };
