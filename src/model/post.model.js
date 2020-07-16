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
        post_body: {
            type: String,
            required: true
        },
        upvote_users: [{
            upvote_username: String
        }],
        post_time: {
            type: Date,
            default: Date.now

        },
        comments: [
            {
                comment_username: String,
                comment_body: {
                    type: String,
                    required: true
                },
                comment_tags: [String],
                comment_upvote_users: [String],
                comment_time: {
                    type: Date,
                    default: Date.now

                }
            }
        ]
    }],
    favourite_users: [String]
});

module.exports = mongoose.model('post', postSchema, 'post_list');
