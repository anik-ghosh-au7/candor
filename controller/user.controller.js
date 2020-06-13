const User = require('../model/user.model');
const { validationResult } = require('express-validator');
const  bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user_controller = {

    createUser: async (req, res) => {
        if(req.user){
            return res.redirect('/');
        }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    };

    try {
        let hashed_password = await bcrypt.hash(req.body.password, 5);
        let entry = new User({
            username: req.body.username,
            password: hashed_password,
            email: req.body.email,
            phone: req.body.phone
        });
        entry.save(function (err) {
            if (err) {
                // not acceptable
                res.status(406).send(err.message);
            } else {
                // created
                res.status(201).send('User created successfully');
            }
    });
    } catch {
        res.status(500).send('Internal error occured')
    };
    },

    login: (req, res) => {
        if(req.user){
            return res.redirect('/');
        }
        let username = req.body.username;
        let password = req.body.password;
        User.findOne({username}, async (err, data) => {
            if (err) {
                // Internal server error
                res.status(500).send({msg: "Internal Server Error"});
            } else {
                // OK
                if (data) {
                    try {
                        if (await bcrypt.compare(password, data.password)) {
                            const accessToken = jwt.sign({name: username}, 'verysecretkey')
                            // res.status(200).json({accessToken});
                            res.status(200).send({token: accessToken});
                            res.cookie('awtToken',accessToken, { maxAge: 900000, httpOnly: true })
                        } else {
                            res.status(401).send('Unauthorized access');
                        }
                    } catch {
                        res.status(400).send('Bad request');
                    }
                }
                else {
                    // no data
                    res.status(204).send(data);
                }
            };
        });
    },

    // logout:(req,res)=>{
    //     req.
    //
    // }

    // getposts: (req, res) => {
    //     let username = req.user.name;
    //     Todo.find({username}, (err, data) => {
    //         if (err) {
    //             // Internal server error
    //             res.status(500).send({msg: "Internal Server Error"});
    //         } else {
    //             // OK
    //             if (data.length !== 0) {
    //                 // ok
    //                 res.status(200).send(data)
    //             }
    //             else {
    //                 // no data
    //                 res.status(204).send(data);
    //             }
    //         };
    //     });
    // }
};

module.exports = user_controller;
