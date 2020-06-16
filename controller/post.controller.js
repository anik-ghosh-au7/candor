const Post = require('../model/post.model');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

const post_controller = {
    createPost: (req, res) => {
        if (!req.user) {
            return res.redirect('/loginPage');
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        ;
        Post.findOne({url: req.body.url}, (err, data) => {
            if (err) {
                res.status(500).send({msg: "Internal Server Error"});
            } else {
                var tag=req.body.post_body.match(/(#[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/g);
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
                            // not acceptable
                            res.status(406).send(err.message);
                        } else {
                            // created
                            res.json({
                                url: req.body.url,
                                post: [{
                                    username: req.body.username,
                                    category: req.body.category,
                                    post_tags: tag,
                                    post_body: req.body.post_body
                                }]
                            });
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
                        function (err, data) {
                            if (err) console.log(err);
                            res.json(data)
                        }
                    );
                }
            }

        })

    }
};
module.exports = post_controller;
