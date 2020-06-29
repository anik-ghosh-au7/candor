const Post = require('../model/post.model');
const {validationResult} = require('express-validator');

var app = {};

const post_controller = {
    createPost: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        ;
        let hitUrl = `/post/render?current_url=${encodeURIComponent(req.body.url)}&category=${req.body.category}`;
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
            console.log(result);
            let hitUrl = `/post/render?current_url=${encodeURIComponent(current_url)}&category=${req.body.category}`;
            res.redirect(hitUrl)
        })
        .catch(err => console.log(err));

    },
    renderPost: (req, res) => {
        let current_url = decodeURIComponent(req.query.current_url);
        let category = req.query.category;
        console.log(current_url, category);
        Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}])
            .then((result) => {
                res.render('index', {posts: result, url: current_url, viewername: req.user.name, category})
            })
            .catch(err => console.log(err));
    }
};
module.exports = {post_controller, app};
