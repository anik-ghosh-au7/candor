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
        };
        /*
        * body.category
        * body.url
        * body.postbody
        * */
    }
}
