import Chat from '../model/chat.model';

let dbInterface = {

        // Join user to chat
        userJoin: async function (username, room) {
            console.log('ENTERED userJoin ');
            await Chat.findOneAndUpdate({room_name: room},
                {
                    "$addToSet": {
                        "active_users": username
                    }
                }, {upsert: true})
                .then((result) => {
                    console.log(`EXECUTED ${username} joined room ${room} `);

                })
                .catch(err => console.log(err));
        },

        //Load chat history
        getChatHistory: async function (room) {
            return await Chat.findOne({room_name: room}, {chat_history: 1}).limit(5).then((res)=>{
                console.log(res,'->from db interface history');
                if(res){
                    return res;
                }else{
                    return []
                }
            });
        },

        // Get room users
        getRoomUsers: async function (room) {
            let room_users;
            console.log('ENTERED getroomusers');
            return await Chat.findOne({room_name: room})
                .then(result => {
                    console.log('EXECUTED', result.active_users);
                    room_users = result.active_users;
                    return result.active_users;
                })
                .catch(err => console.log(err));
        },

        //Saves chat messages to the database
        saveChatHistory: async function (room, username, text, time) {
            await Chat.findOneAndUpdate({room_name: room},
                {
                    "$push": {
                        "chat_history": {
                            username,
                            time,
                            text
                        }
                    }
                }, {upsert: true})
                .then((result) => {
                    console.log(`chat history saved`);
                })
                .catch(err => console.log(err));
        },
        // User leaves chat
        userLeave: async function (username, room) {
            console.log('ENTERED user leave');
            await Chat.findOneAndUpdate({room_name: room},
                {
                    "$pull": {
                        "active_users": username
                    }
                })
                .then((result) => {
                    console.log(`EXECUTED ${username} left room ${room}`);
                })
                .catch(err => console.log(err));
        },

    }
;
module.exports = dbInterface;
