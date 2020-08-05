import User from '../model/user.model';
import webpush from 'web-push';

const message_controller = {
    handle_messages: async function (req, res) {
        let isReceiver = false;
        let isFriend = false;
        await User.findOne({username: req.body.share_username}).then(result => {
            if (result) {
                isReceiver = true;
                result.friend_list.forEach((friend) => {
                    if (friend === req.body.user) isFriend = true;
                });
                // console.log(result.friend_list,req.body.share_username);
            }

        });
        // console.log(isFriend);
        // console.log('body',req.body);
        if (isFriend) {
            await User.findOneAndUpdate({username: req.body.share_username}, {
                "$push": {
                    "received_messages": {
                        sender: req.body.user,
                        shared_url: req.body.context,
                        msg_body: req.body.comments
                    }
                }
            })
                .then((result) => {
                    if (result) {
                        console.log("receiver message saved");
                        // res.status(200).send('Message sent');
                        // let message = req.body.comments.length < 30 ? req.body.comments : req.body.comments.slice(0, 29) + '...';
                        let payload = JSON.stringify({
                            title: `New message from ${req.body.user}`,
                            msg_body: req.body.comments
                        });
                        User.findOne({username: req.body.share_username}).then(result => {
                            // console.log('sub_obj : ', JSON.parse(result.subscription));
                            result.subscription.forEach(element => {
                                webpush.sendNotification(JSON.parse(element), payload)
                            });
                        }).catch(err => console.error(err));
                    }
                })
                .catch(err => console.log(err));
        } else {
            await User.findOneAndUpdate({username: req.body.share_username}, {
                "$push": {
                    "other_messages": {
                        sender: req.body.user,
                        shared_url: req.body.context,
                        msg_body: req.body.comments
                    }
                }
            }).then(() => console.log('msg saved in others')).catch(err => console.log(err));
        }
        ;

        if (isReceiver) {
            User.findOneAndUpdate({username: req.body.user}, {
                "$push": {
                    "sent_messages": {
                        reciever: req.body.share_username,
                        shared_url: req.body.context,
                        msg_body: req.body.comments
                    }
                }
            })
                .then(() => {
                    console.log('sender message saved');
                    res.status(200).send('Message sent');
                })
                .catch(err => console.log(err));
        } else {
            res.status(400).send("Username doesn't exist");
        }
    },

    handle_post_comment_messages: function (receiver, sender, url, body, title) {
        User.findOneAndUpdate({username: receiver}, {
            "$push": {
                "received_messages": {
                    sender: sender,
                    shared_url: url,
                    msg_body: body
                }
            }
        })
            .then((result) => {
                if (result) {
                    console.log("receiver message saved");
                    let message = body.length < 30 ? body : body.slice(0, 29) + '...';
                    let payload = JSON.stringify({
                        title: title,
                        msg_body: message
                    });
                    User.findOne({username: receiver}).then(result => {
                        result.subscription.forEach(element => {
                            webpush.sendNotification(JSON.parse(element), payload)
                        });
                        return;
                    }).catch(err => console.error(err));
                }
            })
            .catch(err => console.log(err));
    },

    handle_requests: function (receiver, body, title) {
        User.findOne({username: receiver})
            .then((result) => {
                if (result.subscription) {
                    let message = body;
                    let payload = JSON.stringify({
                        title: title,
                        msg_body: message
                    });
                    result.subscription.forEach(elem => {
                        webpush.sendNotification(JSON.parse(elem), payload)
                    })
                }
            })
            .catch(err => console.log(err));

    },

    getmsg: function (req, res) {
        let messages = {};
        User.findOne({username: req.user.name}).then((result) => {
            // console.log(result);
            messages.received = result.received_messages;
            messages.sent = result.sent_messages;
            messages.username = req.user.name;
            messages.others = result.other_messages;
            res.render('msg_inbox_outbox', {messages});
        });
        // res.render('msg_inbox_outbox',[{'sent':messages.sent},{'received':messages.received}]);

    }
};
module.exports = message_controller;
