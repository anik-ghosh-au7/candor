import User from '../model/user.model';
import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cloudinary from '../utils/cloudinary';
import buff2Str from '../utils/convertBuffToStr';
dotenv.config();

let dict = {};
let image_url;
let imageContent;

const user_controller = {
    //
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
        if (req.file) {
            imageContent = buff2Str(req.file.originalname, req.file.buffer).content;
            await cloudinary.uploader.upload(imageContent, (err, imageResponse) => {
                if (err) console.log(err);
                else {
                    image_url = imageResponse.secure_url;
                    console.log('log from cloudinary', image_url)
                }
            });

        }
        try {
            let hashed_password = await bcrypt.hash(req.body.password, 5);
            let entry = new User({
                username: req.body.username,
                password: hashed_password,
                email: req.body.email,
                phone: req.body.phone,
                image_url: image_url
            });
            if(!entry.image_url){
                delete entry.image_url;
            }
            console.log(entry);
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
                            const accessToken = jwt.sign({
                                name: username,
                                img: data.image_url,
                                email: data.email,
                                phone: data.phone
                            }, process.env.jwt_key);
                            // res.cookie('awtToken', accessToken, {maxAge: 9000000, httpOnly: true});
                            res.cookie('awtToken', accessToken, {maxAge: 9000000});
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
                    res.redirect('/');
                }
            };
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
        console.log(otp);
        if (dict[email]) {
            clearInterval(dict[email][1]);
            delete dict[email];
        }
        dict[email] = [otp, clearOTP(dict, email)];

        async function main() {
            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.email_otp_id,
                    port: 465,
                    secure: true,
                    pass: process.env.email_otp_password,
                },
            });

            let info = await transporter.sendMail({
                from: "Candor ",
                to: email,
                subject: "OTP from Candor",
                text: `For sign up to Candor, please use this OTP ${otp}. This OTP will be valid for 30 mins`, // plain text body
                html: `<b><H2>For sign up, please use this OTP ${otp}</H2><br> OTP will be valid for 30 mins</b>` // html body
            });
        }

        main().then(() => res.send('OTP sent')).catch(() => {
            console.error();
        })
    },
    submit_otp: (req, res) => {
        let otp = req.query.otp;
        let email = req.query.email;
        if (dict[email] && dict[email][0] === otp) {
            res.send('OTP verified')
        } else {
            res.send('Wrong OTP');
        }
    },
    removeSubscription : (req, res, next) => {
        const token = req.cookies['subToken'];
            if (!token) {
            next()
        }else{
            jwt.verify(token, process.env.jwt_key, (err, data) => {
                if (err) return res.status(403).send({msg: 'Invalid token'});
                console.log(req.user, data.subscription);
                User.findOneAndUpdate({username: req.user}, {$pull: {subscription: data.subscription}})
                .then(next())
                .catch(err => console.log(err));
        });
        }    
    },
    logout: (req, res) => {
        res.clearCookie('awtToken');
        res.clearCookie('subToken');
        res.render('logged_out')
    },
    setSubscription: async (req, res) => {
        const subToken = jwt.sign({
            subscription: JSON.stringify(req.body)
        }, process.env.jwt_key);
        res.cookie('subToken', subToken);
        User.findOneAndUpdate({username: req.user}, {$addToSet: {subscription: JSON.stringify(req.body)}}, {upsert: true})
        // .then(() => res.status(201).send('subscribed'))
        .then(() => res.status(201).json({}))
        .catch(err => console.log(err));
    },
    addFavourites: (username, url) => {
        User.findOneAndUpdate({username}, {
            "$push": {
                "favourite_urls": url
            }
        }, {upsert: true})
        .then(() => {
            console.log(`${url} added to ${username}'s favourites!!!`);
            return;
        })
        .catch(err => console.log(err));
    },
    removeFavourites: (username, url) => {
        User.findOneAndUpdate({username}, {
                "$pull": {
                    "favourite_urls": url
                }
            }, {new: true})
            .then(() => {
                console.log(`${url} removed from ${username}'s favourites!!!`);
                return;
            })
            .catch(err => console.log(err));
    },
    getFavourites: (req, res) => {
        User.findOne({username: req.user}).then(result => {
            res.render('favourites', {username:  req.user, favourites: result.favourite_urls});
        }).catch(err => console.error(err));
    }
};


function generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function clearOTP(dict, key) {
    return setTimeout(() => {
        delete dict[key];
    }, 1000 * 60 * 30);
}

module.exports = user_controller;
