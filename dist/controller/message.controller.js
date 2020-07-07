"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _user = _interopRequireDefault(require("../model/user.model"));

var message_controller = {
  handle_incoming: function handle_incoming(req, res) {
    console.log('body', req.body);

    _user["default"].findOneAndUpdate({
      username: req.body.share_username
    }, {
      "$push": {
        "messages": {
          sender: req.body.user,
          shared_url: req.body.context,
          msg_body: req.body.comments
        }
      }
    }).then(function (result) {
      if (result) {
        console.log("Message saved");
        res.status(200).send('Message sent');
      } else {
        res.send("Username Doesn't exist");
      }
    })["catch"](function (err) {
      return console.log(err);
    });
  }
};
module.exports = message_controller;
//# sourceMappingURL=message.controller.js.map