"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var chatSchema = new Schema({
  room_name: String,
  chat_history: [{
    username: String,
    time: String,
    text: String
  }],
  active_users: [String]
}, {
  versionKey: false
});
module.exports = mongoose.model('chat', chatSchema, 'chat_list');
//# sourceMappingURL=chat.model.js.map