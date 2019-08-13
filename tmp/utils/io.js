/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const fs = require('fs');
const path = require('path');
const error = require('../utils/error');

function isExists(path) {
  return fs.existsSync(path);
}

/**
 * 
 * @param {string} dir - The absolute path of directory.
 */
function createDir(pathDir) {
  if (!isExists(pathDir)) {
    fs.mkdir(pathDir, function (err) {
      if (err) {
        throw err;
      }
    });
  }
}

function removeAllFile(pathDir) {
  fs.readdir(pathDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(pathDir, file), err => {
        if (err) throw err;
      });
    }
  });
}

function removeFile(pathFile) {
  if (isExists(pathFile)) {
    fs.unlink(pathFile, err => {
      if (err) throw err;
    });
  }
}

function writeFile(pathFile, conent) {
  fs.open(pathFile, 'w+', function (err, fd) {
    if (err) {
      throw err;
    }
    fs.write(fd, conent, function (err, written, string) {
      if (err) {
        throw err;
      }
      if (written !== conent.length) {
        throw error.writtenNumber;
      }
      if (string !== conent) {
        throw error.writtenContent;
      }
      fs.close(fd, function (err) {
        if (err) {
          throw err;
        }
      });
    })
  });
}

module.exports = {
  isExists,
  createDir,
  removeAllFile,
  removeFile,
  writeFile,
}