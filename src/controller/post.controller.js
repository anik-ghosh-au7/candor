import Post from '../model/post.model';
import {validationResult} from 'express-validator';
import {ObjectId} from 'mongodb';

const app = {};

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

                const tag = req.body.post_body.match(/(#[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/g);
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
                    entry.save(err => {
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
                        err => {
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
        const tag = req.body.comment_body.match(/(#[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/g);

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
            .then(() => {
                let hitUrl = `/post/render?current_url=${encodeURIComponent(current_url)}&category=${req.body.category}`;
                res.redirect(hitUrl)
            })
            .catch(err => console.log(err));

    },
    renderPost: async (req, res) => {
        let current_url = decodeURIComponent(req.query.current_url);
        let category = req.query.category;
        let limit = 3;
        let page = parseInt(req.query.page);
        const endIndex = page * limit;
        let total_length;
        let query;
        let search_by_username = req.query.search_username;
        let sort_likes = req.query.sort_likes;

        if (sort_likes) {
            if (search_by_username) {
                await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {
                    $match: {
                        'post.category': category,
                        'post.username': search_by_username
                    }
                }]).then(result => total_length = result.length).catch(err => console.log(err));
                query = Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {
                    $match: {
                        'post.category': category,
                        'post.username': search_by_username
                    }
                }, {$addFields: {upvote_count: {$size: "$post.upvote_users"}}}, {
                    $sort: {
                        "upvote_count": -1,
                        'post.post_time': -1
                    }
                }, {$skip: (page - 1) * limit}, {$limit: limit}])
            } else {
                await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}]).then(result => total_length = result.length).catch(err => console.log(err));
                query = Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}, {$addFields: {upvote_count: {$size: "$post.upvote_users"}}}, {
                    $sort: {
                        "upvote_count": -1,
                        'post.post_time': -1
                    }
                }, {$skip: (page - 1) * limit}, {$limit: limit}])
            }
        } else {
            if (search_by_username) {
                await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {
                    $match: {
                        'post.category': category,
                        'post.username': search_by_username
                    }
                }]).then(result => total_length = result.length).catch(err => console.log(err));
                query = Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {
                    $match: {
                        'post.category': category,
                        'post.username': search_by_username
                    }
                }, {$sort: {'post.post_time': -1}}, {$skip: (page - 1) * limit}, {$limit: limit}])
            } else {
                await Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}]).then(result => total_length = result.length).catch(err => console.log(err));
                query = Post.aggregate([{$match: {url: current_url}}, {$unwind: '$post'}, {$match: {'post.category': category}}, {$sort: {'post.post_time': -1}}, {$skip: (page - 1) * limit}, {$limit: limit}])
            }
        }

        query.exec()
            .then(result => {
                if (endIndex >= total_length) {
                    result.has_next = false;
                } else {
                    result.has_next = true;
                    result.next_page = page + 1
                }
                if (page === 1) {
                    result.has_prev = false;
                } else {
                    result.has_prev = true;
                    result.prev_page = page - 1
                }
                attach_likes(result, req.user.name);

                res.render('index', {
                    posts: result,
                    url: current_url,
                    viewername: req.user.name,
                    category,
                    user: req.user
                })
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
            Post.findOneAndUpdate({url, "post._id": id},
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
            Post.findOneAndUpdate({url, "post._id": id},
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

    },
    getTrendingTags: async (req, res) => {
        let current_url = decodeURIComponent(req.query.current_url);
        let category = req.query.category;
        let final_result = {};
        await Post.aggregate([{$match: {url: current_url}},
            {$unwind: '$post'},
            {$match: {'post.category': category}},
            {$match: {'post.post_tags': {"$exists": true, "$ne": null}}},
            {$unwind: '$post.post_tags'},
            {$group: {'_id': {'post_tags': '$post.post_tags'}, 'count': {'$sum': 1}}}])
            .then(result => {
                result.forEach(element => {
                    final_result[element._id.post_tags] = element.count;
                });
            })
            .catch(err => console.log(err))

        await Post.aggregate([{$match: {url: current_url}},
            {$unwind: '$post'},
            {$match: {'post.category': category}},
            {$unwind: '$post.comments'},
            {$match: {'post.comments.comment_tags': {"$exists": true, "$ne": null}}},
            {$unwind: '$post.comments.comment_tags'},
            {$group: {'_id': {'comment_tags': '$post.comments.comment_tags'}, 'count': {'$sum': 1}}}])
            .then(result => {
                    result.forEach(element => {
                        if (!final_result[element._id.comment_tags]) {
                            final_result[element._id.comment_tags] = element.count;
                        } else {
                            final_result[element._id.comment_tags] += element.count;
                        }
                    });
                    let sortable = [];
                    for (let result in final_result) {
                        sortable.push([result, final_result[result]]);
                    }

                    sortable.sort((a, b) => {
                        return b[1] - a[1];
                    });
                    let final_str = '<ul class="list-group">';
                    sortable = sortable.slice(0, 10);
                    for (let i = 0; i < sortable.length; i += 1) {
                        final_str += '<li class="list-group-item d-flex justify-content-between align-items-center">' +
                            sortable[i][0] +
                            `<span class="badge badge-primary badge-pill">${sortable[i][1]}</span></li>`;
                    }
                    final_str += '</ul>';
                    res.send(final_str)
                }
            )
            .catch(err => console.log(err))
    }
};
module.exports = {post_controller, app};

function attach_likes(result, name) {
    let post_outer;
    for (post_outer of result) {
        post_outer.post.user_like = false;
        post_outer.post.like_count = post_outer.post.upvote_users.length;
        let user;
        for (user of post_outer.post.upvote_users) {
            if (user.upvote_username === name) {
                post_outer.post.user_like = true;
            }
        }
    }
}
