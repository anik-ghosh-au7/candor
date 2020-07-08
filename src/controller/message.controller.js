import User from '../model/user.model';

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
    }
};
module.exports=message_controller;
