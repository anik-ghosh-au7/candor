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
        upvote_users: [{
            upvote_username: String
        }],
        post_time: {
            type: Date,
            default:Date.now

        },
        comments: [
            {
                comment_username: String,
                comment_body: String,
                comment_tags: [String],
                comment_upvote_users: [String],
                comment_time: {
                    type: Date,
                    default: Date.now

                }
            }
        ]
    }]
});

module.exports = mongoose.model('post', postSchema, 'post_list');
