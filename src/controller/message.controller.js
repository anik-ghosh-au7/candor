import User from '../model/user.model';

const message_controller={
    handle_incoming:function (req,res) {
        console.log('body',req.body);
        User.findOneAndUpdate({username:req.body.share_username},{
                    "$push": {
                        "messages": {
                            sender:req.body.user,
                            shared_url:req.body.context,
                            msg_body:req.body.comments
                        }
                    }
                })
                .then((result) => {
                    if(result){
                        console.log("Message saved");
                        res.status(200).send('Message sent')
                    }else{
                        res.send("Username Doesn't exist")
                    }

                })
                .catch(err => console.log(err));
    }
};
module.exports=message_controller;
