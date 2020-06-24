const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        default:"./../images/default-profile-picture1.jpg"
    }
}, {
   versionKey: false
});

module.exports = mongoose.model('user', userSchema, 'user_list');
