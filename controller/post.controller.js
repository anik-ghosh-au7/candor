const Post = require('../model/post.model');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
var app = {};

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
                            return res.render('index');
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
                            // res.json(data)
                            res.redirect('/post')
                        }
                    );
                }
            }

        })

    },
    allPosts: (req, res) => {
        let redirect_url = `/post/render?current_url=${encodeURIComponent(req.body.current_url)}&category=${req.body.context}`;
        return res.redirect(redirect_url);

    },
    renderPost:(req,res)=>{
        let current_url=decodeURIComponent(req.query.current_url);
        let category= req.query.category;
        console.log(current_url,category);
        Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}])
            .then((result) => {
                res.render('index', {posts:result,url:current_url,viewername:req.user.name,category})
            })
            .catch(err => console.log(err));
    }
};
module.exports = {post_controller,app};
