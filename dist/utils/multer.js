"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var memoryStorage = _multer["default"].memoryStorage();

var cloudUpload = (0, _multer["default"])({
  storage: memoryStorage,
  fileFilter: function fileFilter(req, file, callback) {
    var ext = _path["default"].extname(file.originalname);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(res.end('Only images are allowed'), null);
    }

    callback(null, true);
  }
}).single('image');
module.exports = cloudUpload;
//# sourceMappingURL=multer.js.map