const Post = require('../model/post.model');
const {validationResult} = require('express-validator');
var ObjectId = require('mongodb').ObjectId

var app = {};

const post_controller = {
    createPost: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        ;
        let hitUrl = `/post/render?current_url=${encodeURIComponent(req.body.url)}&category=${req.body.category}&page=1`;
        Post.findOne({url: req.body.url}, (err, data) => {
            if (err) {
                res.status(500).send({msg: "Internal Server Error"});
            } else {

                var tag = req.body.post_body.match(/(#[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/g);
                if (!data) {
                    let entry = new Post({
                        url: req.body.url,
                        post: [{
                            username: req.body.username,
                            category: req.body.category,
                            post_tags: tag,
                            post_body: req.body.post_body
                        }]
                    });
                    entry.save(function (err) {
                        if (err) {
                            res.status(406).send(err.message);
                        } else {
                            return res.redirect(hitUrl);
                        }
                    });
                } else {
                    Post.findOneAndUpdate({url: req.body.url},
                        {
                            "$push": {
                                "post": {
                                    username: req.body.username,
                                    category: req.body.category,
                                    post_tags: tag,
                                    post_body: req.body.post_body
                                }
                            }
                        }, {"new": true},
                        function (err) {
                            if (err) console.log(err);
                            res.redirect(hitUrl);
                        }
                    );
                }
            }

        })

    },
    createComment: (req, res) => {

        let current_url = req.body.url;
        let post_id = req.body.post_id;
        var tag = req.body.comment_body.match(/(#[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/g);

        Post.findOneAndUpdate({url: current_url, "post._id": post_id},
            {
                "$push": {
                    "post.$.comments": {
                        comment_username: req.body.username,
                        comment_tags: tag,
                        comment_body: req.body.comment_body
                    }
                }
            }, {"new": true})
            .then((result) => {
                let hitUrl = `/post/render?current_url=${encodeURIComponent(current_url)}&category=${req.body.category}`;
                res.redirect(hitUrl)
            })
            .catch(err => console.log(err));

    },
    renderPost: async (req, res) => {
        let current_url = decodeURIComponent(req.query.current_url);
        let category = req.query.category;
        let limit = 3;
        let page=parseInt(req.query.page);
        const endIndex = page * limit;
        let total_length;
        let query;
        let search_by_username = req.query.search_username;

        if (search_by_username) {
            await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category, 'post.username': search_by_username}}]).then(result => total_length=result.length).catch(err => console.log(err)); 
            query = Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category, 'post.username': search_by_username}}, {$skip: (page - 1) * limit}, {$limit: limit}])
        } 
        else {
            await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}]).then(result => total_length=result.length).catch(err => console.log(err)); 
            query = Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}, {$skip: (page - 1) * limit}, {$limit: limit}])
        }
        query.exec()
            .then(result => {
                if (endIndex >= total_length) {
                    result.has_next = false;
                }else{
                    result.has_next=true;
                    result.next_page=page+1
                }
                if (page===1){
                    result.has_prev=false;
                }else{
                    result.has_prev=true;
                    result.prev_page=page-1
                }
                attach_likes(result, req.user.name);
                res.render('index', {posts: result, url: current_url, viewername: req.user.name, category})
            })
            .catch(err => console.log(err));
    },
    getdata: async (req, res) => {
        let current_url = decodeURIComponent(req.query.current_url);
        let data = {};
        await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': 'question'}}]).then(result => {
            data.question = result.length
        });
        await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': 'admin'}}]).then(result => {
            data.admin = result.length
        });
        await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': 'related'}}]).then(result => {
            data.related = result.length
        });
        await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': 'others'}}]).then(result => {
            data.others = result.length
        });
        res.status(200).send(data);
    },
    updateLike: async (req, res) => {
        let current_url = decodeURIComponent(req.query.current_url);
        let post_id = req.query.post_id;
        let like_search_result = {};

        const add_like = (url, id, name) => {
            Post.findOneAndUpdate({url: url, "post._id": id},
                {
                    "$push": {
                        "post.$.upvote_users": {
                            upvote_username: name
                        }
                    }
                }, {"new": true})
                .then((result) => {
                    res.send('liked');
                })
                .catch(err => console.log(err));
        };
        const delete_like = (url, id, name) => {
            Post.findOneAndUpdate({url: url, "post._id": id},
                {
                    "$pull": {
                        "post.$.upvote_users": {
                            upvote_username: name
                        }
                    }
                }, {"new": true})
                .then((result) => {
                    res.send('unliked');
                })
                .catch(err => console.log(err));
        };

        await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post._id': ObjectId(post_id)}}, {$unwind: '$post.upvote_users'}, {$match: {'post.upvote_users.upvote_username': req.user.name}}])
            .then((result) => {
                like_search_result[req.user.name] = result;
                if (like_search_result[req.user.name].length === 0) {
                    add_like(current_url, post_id, req.user.name);
                } else {
                    delete_like(current_url, post_id, req.user.name);
                }
                ;
                delete like_search_result[req.user.name];
            })
            .catch(err => console.log(err));

    }
};
module.exports = {post_controller, app};

function attach_likes(result, name) {
    for (post_outer of result) {
        post_outer.post.user_like = false;
        post_outer.post.like_count = post_outer.post.upvote_users.length;
        for (user of post_outer.post.upvote_users) {
            if (user.upvote_username === name) {
                post_outer.post.user_like = true;
            }
        }
    }
}
