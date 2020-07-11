"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../model/user.model"));

var _webPush = _interopRequireDefault(require("web-push"));

var message_controller = {
  handle_messages: function () {
    var _handle_messages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var flag;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              flag = false; // console.log('body',req.body);

              _context.next = 3;
              return _user["default"].findOneAndUpdate({
                username: req.body.share_username
              }, {
                "$push": {
                  "received_messages": {
                    sender: req.body.user,
                    shared_url: req.body.context,
                    msg_body: req.body.comments
                  }
                }
              }).then(function (result) {
                if (result) {
                  console.log("receiver message saved"); // res.status(200).send('Message sent');

                  var message = req.body.comments.length < 30 ? req.body.comments : req.body.comments.slice(0, 29) + '...';
                  var payload = JSON.stringify({
                    title: "New message from ".concat(req.body.user),
                    msg_body: message
                  });

                  _user["default"].findOne({
                    username: req.body.share_username
                  }).then(function (result) {
                    // console.log('sub_obj : ', JSON.parse(result.subscription));
                    _webPush["default"].sendNotification(JSON.parse(result.subscription), payload);
                  })["catch"](function (err) {
                    return console.error(err);
                  });

                  flag = true;
                } else {
                  // res.status(400).send("Username doesn't exist");
                  flag = false;
                }
              })["catch"](function (err) {
                return console.log(err);
              });

            case 3:
              if (flag) {
                _user["default"].findOneAndUpdate({
                  username: req.body.user
                }, {
                  "$push": {
                    "sent_messages": {
                      reciever: req.body.share_username,
                      shared_url: req.body.context,
                      msg_body: req.body.comments
                    }
                  }
                }).then(function () {
                  console.log('sender message saved');
                  res.status(200).send('Message sent');
                })["catch"](function (err) {
                  return console.log(err);
                });
              } else {
                res.status(400).send("Username doesn't exist");
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function handle_messages(_x, _x2) {
      return _handle_messages.apply(this, arguments);
    }

    return handle_messages;
  }(),
  handle_post_messages: function handle_post_messages(receiver, sender, url, body) {
    _user["default"].findOneAndUpdate({
      username: receiver
    }, {
      "$push": {
        "received_messages": {
          sender: sender,
          shared_url: url,
          msg_body: body
        }
      }
    }).then(function (result) {
      if (result) {
        console.log("receiver message saved");
        var message = body.length < 30 ? body : body.slice(0, 29) + '...';
        var payload = JSON.stringify({
          title: "New post from ".concat(sender),
          msg_body: message
        });

        _user["default"].findOne({
          username: receiver
        }).then(function (result) {
          _webPush["default"].sendNotification(JSON.parse(result.subscription), payload);

          return;
        })["catch"](function (err) {
          return console.error(err);
        });
      }
    })["catch"](function (err) {
      return console.log(err);
    });
  },
  getmsg: function getmsg(req, res) {
    var messages = {};

    _user["default"].findOne({
      username: req.user.name
    }).then(function (result) {
      // console.log(result);
      messages.received = result.received_messages;
      messages.sent = result.sent_messages;
      messages.username = req.user.name;
      res.render('msg_inbox_outbox', {
        messages: messages
      });
    }); // res.render('msg_inbox_outbox',[{'sent':messages.sent},{'received':messages.received}]);

  }
};
module.exports = message_controller;
//# sourceMappingURL=message.controller.js.map