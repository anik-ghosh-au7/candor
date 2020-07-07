"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  image_url: {
    type: String,
    "default": "./../images/default-profile-picture1.jpg"
  },
  messages: [{
    sender: String,
    shared_url: String,
    msg_body: String,
    time: {
      type: Date,
      "default": Date.now
    }
  }]
}, {
  versionKey: false
});
module.exports = mongoose.model('user', userSchema, 'user_list');
//# sourceMappingURL=user.model.js.map