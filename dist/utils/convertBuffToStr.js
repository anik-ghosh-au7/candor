"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _parser = _interopRequireDefault(require("datauri/parser"));

var _path = _interopRequireDefault(require("path"));

var datauri = new _parser["default"]();

module.exports = function (originalName, buffer) {
  var extension = _path["default"].extname(originalName);

  return datauri.format(extension, buffer);
};
//# sourceMappingURL=convertBuffToStr.js.map