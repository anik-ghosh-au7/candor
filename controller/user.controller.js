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
                res.render('login');
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
                            res.cookie('awtToken',accessToken, { maxAge: 9000000, httpOnly: true});
                            return res.redirect('/');
                        } else {
                            res.status(401).send('Unauthorized access');
                        }
                    } catch(err) {
                        console.log(err);
                        res.status(400).send('Bad request');
                    }
                }
                else {
                    // no data
                    // res.status(204).send(data);
                    res.redirect('/');
                }
            };
        });
    },

    loginPage:(req,res)=>{
        console.log('loginRedirect',req.user)
        if(req.user){

            return res.redirect('/');
        }
        res.render('login');
    },
    signPage:(req,res)=>{
        if(req.user){
            return res.redirect('/');
        }
        res.render('signUp');
    },
    logout:(req,res)=>{
        res.clearCookie('awtToken')
        res.render('logged_out')
    }
};

module.exports = user_controller;
