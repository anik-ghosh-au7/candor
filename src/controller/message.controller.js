import User from '../model/user.model';
import webpush from 'web-push';

const message_controller={
    handle_messages: async function (req,res) {
        let flag = false;
        console.log('body',req.body);
        await User.findOneAndUpdate({username:req.body.share_username},{
                    "$push": {
                        "received_messages": {
                            sender: req.body.user,
                            shared_url: req.body.context,
                            msg_body: req.body.comments
                        }
                    }
                })
                .then((result) => {
                    if(result){
                        console.log("receiver message saved");
                        // res.status(200).send('Message sent');
                        let payload = JSON.stringify({ 
                        title: "New notification", 
                        // sender: req.body.user,
                        // shared_url: req.body.context,
                        // msg_body: req.body.comments 
                    });
                    User.findOne({username: req.body.share_username}).then(result => {
                        console.log('sub_obj : ', JSON.parse(result.subscription));
                        webpush.sendNotification(JSON.parse(result.subscription), payload)
                    }).catch(err => console.error(err));
                        flag = true;
                    }else{
                        // res.status(400).send("Username doesn't exist");
                        flag = false;
                    }
                })
                .catch(err => console.log(err));

            if (flag) {
                User.findOneAndUpdate({username:req.body.user},{
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
    getmsg: function (req,res) {
        let messages={};
        User.findOne({username:req.user.name}).then((result)=>{
            // console.log(result);
            messages.received=result.received_messages;
            messages.sent=result.sent_messages;
            messages.username=req.user.name;
            res.render('msg_inbox_outbox',{messages});
        });
            // res.render('msg_inbox_outbox',[{'sent':messages.sent},{'received':messages.received}]);

    }
};
module.exports=message_controller;
