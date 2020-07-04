const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    room_name: String,
    chat_history: [{
        username: String,
        time: String,
        body: String
    }],
    active_users: [String]
}, {
   versionKey: false
});

module.exports = mongoose.model('chat', chatSchema, 'chat_list');