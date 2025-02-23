const fs = require('fs');
const path = require('path');

exports.ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

exports.getComponentName = (filePath) => {
  const basename = path.basename(filePath);
  return basename.replace(/\.(jsx?|tsx?)$/, '');
}; 