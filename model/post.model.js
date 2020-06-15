const mongoose = require('mongoose');
const { v4 } = require('uuid');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    post:[{
        username:String,
        category:String,
        post_tags:[String],
        post_body:String,
        post_id:v4(),
        upvote_count:Number,
        comments:[
            {
                comment_username:String,
                comment_id:v4(),
                comment_body:String,
                comment_tags:[String],
                comment_upvote_count:Number
            }
        ]
    }]
});

module.exports = mongoose.model('post', postSchema, 'post_list');
