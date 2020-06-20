const User = require('../model/user.model');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var dict = {};
//Keys for otp twilio api

const user_controller = {

    createUser: async (req, res) => {
        if (req.user) {
            return res.redirect('/');
        }
        const errors = validationResult(req);

        if (!dict[req.body.email] || dict[req.body.email] !== req.body.OTP) {
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
                            const accessToken = jwt.sign({name: username}, 'verysecretkey')
                            // res.status(200).json({accessToken});
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
        console.log('loginRedirect', req.user)
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
        console.log(req.body.email);
        let email = req.body.email;
        let otp = generateOTP();
        dict[email] = otp;

        async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'au7wood@gmail.com', // generated ethereal user
                    port: 465,
                    secure: true,
                    pass: 'cfor4cat111', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo " <au7wood@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: `For sign up to Candor, please use this OTP `, // plain text body
                html: `<b>Hello world?</b>${otp}` // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().then(() => res.send('OTP sent')).catch(()=>{console.error();})
    },
    submit_otp: (req, res) => {
        let otp = req.query.otp;
        let email = req.query.email;
        if (dict[email] === otp) {
            res.send('otp verified')
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
    setTimeout(() => {
        delete dict[key];
    }, 1000 * 60 * 30);
}

module.exports = user_controller;
