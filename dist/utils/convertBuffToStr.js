"use strict";

var DataUri = require('datauri/parser');

var path = require('path');

var datauri = new DataUri();

module.exports = function (originalName, buffer) {
  var extension = path.extname(originalName);
  return datauri.format(extension, buffer);
};
//# sourceMappingURL=convertBuffToStr.js.map