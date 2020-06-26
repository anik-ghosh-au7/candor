"use strict";

var multer = require('multer');

var path = require('path');

var memoryStorage = multer.memoryStorage();
var cloudUpload = multer({
  storage: memoryStorage,
  fileFilter: function fileFilter(req, file, callback) {
    var ext = path.extname(file.originalname);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(res.end('Only images are allowed'), null);
    }

    callback(null, true);
  }
}).single('image');
module.exports = cloudUpload;
//# sourceMappingURL=multer.js.map