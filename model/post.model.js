const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    post: [{
        username: String,
        category: String,
        post_tags: [String],
        post_body: String,
        upvote_users: [String],
        comments: [
            {
                comment_username: String,
                comment_body: String,
                comment_tags: [String],
                comment_upvote_users: [String]
            }
        ]
    }]
});

module.exports = mongoose.model('post', postSchema, 'post_list');
