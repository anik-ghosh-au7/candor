import User from '../model/user.model';
import messageController from '../controller/message.controller';


const friend_controller={
        addFriend: async (req, res) => {
        let flag = true;

        if (req.user === req.body.friend_username) {
            return res.send("Can't send request to yourself");
        };

        if (flag) {
            await User.findOne({username: req.body.friend_username}).then(result => {
                if (!result) {
                    flag = false;
                    return res.send("Username doesn't exists");
                };
            })
            .catch(err => console.error('1 --> ',err));
        };

        if (flag) {
            await User.findOne({username: req.user}).then(result => {
                for (let i = 0; i < result.friend_list.length; i++) {
                    if (result.friend_list[i] === req.body.friend_username) {
                        flag = false;
                        return res.send(`{req.body.friend_username} is already added`);
                    };
                };
            })
            .catch(err => console.log('2 --> ',err));
        };

        if (flag) {
            await User.findOne({username: req.body.friend_username}).then(search_result => {
                for (let i = 0; i < search_result.received_requests.length; i++) {
                    if (search_result.received_requests[i] === req.user) {
                        flag = false;
                        return res.send(`Friend request is already sent`);
                    };
                };
            })
            .catch(err => console.log('3 --> ',err));
        };

        if (flag) {
            User.findOneAndUpdate(
                {username: req.user},
                {$addToSet: {sent_requests: req.body.friend_username}
            })
            .catch(err => console.log('4 --> ',err));

            User.findOneAndUpdate(
                {username: req.body.friend_username},
                {$addToSet: {received_requests: req.user}
            })
            .then(() => {
                let title = `New friend request from ${req.user}`;
                messageController.handle_requests(req.body.friend_username, '', title, res);
                return res.send("Friend request sent")
            })
            .catch(err => console.log('5 --> ',err));
        };
    },

    respondToRequest: (req, res) => {
        if(req.query.confirm) {
            User.findOneAndUpdate(
                {username: req.user},
                {$addToSet: {friend_list: req.query.friend_username},
                $pull: {received_requests: req.query.friend_username}})
                .catch(err => console.log(err));
            User.findOneAndUpdate(
                {username: req.body.friend_username},
                {$addToSet: {friend_list: req.user},
                $pull: {sent_requests: req.user}})
                .catch(err => console.log(err));
        } else {
            User.findOneAndUpdate(
                {username: req.user},
                {$pull: {received_requests: req.query.friend_username}})
                .catch(err => console.log(err));
            User.findOneAndUpdate(
                {username: req.body.friend_username},
                {$pull: {sent_requests: req.user}})
                .catch(err => console.log(err));
        }
    }
};
module.exports=friend_controller;
