const User = require('../model/user.model');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var dict = {};
require('dotenv').config();

//Keys for otp twilio api

const user_controller = {

    createUser: async (req, res) => {
        if (req.user) {
            return res.redirect('/');
        }
        const errors = validationResult(req);

        if (!dict[req.body.email] || dict[req.body.email][0] !== req.body.OTP) {
            return res.status(400).send('Wrong OTP ');
        }

        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        ;

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
        }
        ;
    },

    login: (req, res) => {
        if (req.user) {
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
                            const accessToken = jwt.sign({name: username}, process.env.jwt_key);
                            res.cookie('awtToken', accessToken, {maxAge: 9000000, httpOnly: true});
                            return res.redirect('/');
                        } else {
                            res.status(401).send('Unauthorized access');
                        }
                    } catch (err) {
                        console.log(err);
                        res.status(400).send('Bad request');
                    }
                } else {
                    // no data
                    // res.status(204).send(data);
                    res.redirect('/');
                }
            }
            ;
        });
    },

    loginPage: (req, res) => {
        if (req.user) {
            return res.redirect('/');
        }
        res.render('login');
    },
    signPage: (req, res) => {
        if (req.user) {
            return res.redirect('/');
        }
        res.render('signUp');
    },
    request_otp: (req, res) => {
        let email = req.body.email;
        let otp = generateOTP();
        if(dict[email]){
            clearInterval(dict[email][1]);
            delete dict[email];
        }
        dict[email] = [otp,clearOTP(dict,email)];

        async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.email_otp_id, // generated ethereal user
                    port: 465,
                    secure: true,
                    pass: process.env.email_otp_password, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: "Candor ", // sender address
                to: email, // list of receivers
                subject: "OTP from Candor", // Subject line
                text: `For sign up to Candor, please use this OTP ${otp}. This OTP will be valid for 30 mins`, // plain text body
                html: `<b><H2>For sign up, please use this OTP ${otp}</H2><br> OTP will be valid for 30 mins</b>` // html body
            });
        }

        main().then(() => res.send('OTP sent')).catch(()=>{console.error();})
    },
    submit_otp: (req, res) => {
        let otp = req.query.otp;
        let email = req.query.email;
        if (dict[email][0] === otp) {
            res.send('Otp verified')
        } else {
            res.send('Wrong OTP');
        }
    },
    logout: (req, res) => {
        res.clearCookie('awtToken')
        res.render('logged_out')
    }
};


function generateOTP() {

    // Declare a digits variable
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function clearOTP(dict, key) {
    return setTimeout(() => {
            delete dict[key];
    }, 1000 * 60 *30 );
}

module.exports = user_controller;
