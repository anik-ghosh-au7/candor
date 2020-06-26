import DataUri from 'datauri/parser';
import path from 'path';

const datauri = new DataUri();

module.exports = (originalName, buffer) => {
    const extension = path.extname(originalName);
    return datauri.format(extension, buffer);
};