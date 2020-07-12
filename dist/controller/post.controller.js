"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _post = _interopRequireDefault(require("../model/post.model"));

var _expressValidator = require("express-validator");

var _mongodb = require("mongodb");

var _message = _interopRequireDefault(require("../controller/message.controller"));

var _user = _interopRequireDefault(require("../controller/user.controller"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var app = {};
var post_controller = {
  createPost: function createPost(req, res) {
    var errors = (0, _expressValidator.validationResult)(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    ;
    var hitUrl = "/post/render?current_url=".concat(encodeURIComponent(req.body.url), "&category=").concat(req.body.category, "&page=1");

    _post["default"].findOne({
      url: req.body.url
    }, function (err, data) {
      if (err) {
        res.status(500).send({
          msg: "Internal Server Error"
        });
      } else {
        var tag = req.body.post_body.match(/(#[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/g);

        if (!data) {
          var entry = new _post["default"]({
            url: req.body.url,
            post: [{
              username: req.body.username,
              category: req.body.category,
              post_tags: tag,
              post_body: req.body.post_body
            }]
          });
          entry.save(function (err) {
            if (err) {
              res.status(406).send(err.message);
            } else {
              return res.redirect(hitUrl);
            }
          });
        } else {
          _post["default"].findOneAndUpdate({
            url: req.body.url
          }, {
            "$push": {
              "post": {
                username: req.body.username,
                category: req.body.category,
                post_tags: tag,
                post_body: req.body.post_body
              }
            }
          }, {
            "new": true
          }, function (err) {
            if (err) console.log(err);
            res.redirect(hitUrl);
          });
        }

        if (data.favourite_users) {
          var title = "New post from ".concat(req.body.username);
          var message = "(Post in ".concat(req.body.category, "): ") + req.body.post_body;
          data.favourite_users.forEach(function (elem) {
            _message["default"].handle_post_comment_messages(elem, req.body.username, req.body.url, message, title);
          });
        }
      }
    });
  },
  createComment: function createComment(req, res) {
    var current_url = req.body.url;
    var post_id = req.body.post_id;
    var post_author = req.body.post_author;
    var post_body = req.body.post_body;
    var tag = req.body.comment_body.match(/(#[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)/g);

    _post["default"].findOneAndUpdate({
      url: current_url,
      "post._id": post_id
    }, {
      "$push": {
        "post.$.comments": {
          comment_username: req.body.username,
          comment_tags: tag,
          comment_body: req.body.comment_body
        }
      }
    }, {
      "new": true
    }).then(function () {
      post_body = post_body.length > 30 ? post_body.slice(0, 30) + '...' : post_body;
      var message = "(Comment in ".concat(post_body, "): ") + req.body.comment_body;
      var title = "New comment from ".concat(req.body.username);

      _message["default"].handle_post_comment_messages(post_author, req.body.username, current_url, message, title);

      var hitUrl = "/post/render?current_url=".concat(encodeURIComponent(current_url), "&category=").concat(req.body.category);
      res.redirect(hitUrl);
    })["catch"](function (err) {
      return console.log(err);
    });
  },
  renderPost: function () {
    var _renderPost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var current_url, category, limit, page, endIndex, total_length, query, search_by_username, sort_likes;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              current_url = decodeURIComponent(req.query.current_url);
              category = req.query.category;
              limit = 3;
              page = parseInt(req.query.page);
              endIndex = page * limit;
              search_by_username = req.query.search_username;
              sort_likes = req.query.sort_likes;

              if (!sort_likes) {
                _context.next = 19;
                break;
              }

              if (!search_by_username) {
                _context.next = 14;
                break;
              }

              _context.next = 11;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category,
                  'post.username': search_by_username
                }
              }]).then(function (result) {
                return total_length = result.length;
              })["catch"](function (err) {
                return console.log(err);
              });

            case 11:
              query = _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category,
                  'post.username': search_by_username
                }
              }, {
                $addFields: {
                  upvote_count: {
                    $size: "$post.upvote_users"
                  }
                }
              }, {
                $sort: {
                  "upvote_count": -1,
                  'post.post_time': -1
                }
              }, {
                $skip: (page - 1) * limit
              }, {
                $limit: limit
              }]);
              _context.next = 17;
              break;

            case 14:
              _context.next = 16;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category
                }
              }]).then(function (result) {
                return total_length = result.length;
              })["catch"](function (err) {
                return console.log(err);
              });

            case 16:
              query = _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category
                }
              }, {
                $addFields: {
                  upvote_count: {
                    $size: "$post.upvote_users"
                  }
                }
              }, {
                $sort: {
                  "upvote_count": -1,
                  'post.post_time': -1
                }
              }, {
                $skip: (page - 1) * limit
              }, {
                $limit: limit
              }]);

            case 17:
              _context.next = 28;
              break;

            case 19:
              if (!search_by_username) {
                _context.next = 25;
                break;
              }

              _context.next = 22;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category,
                  'post.username': search_by_username
                }
              }]).then(function (result) {
                return total_length = result.length;
              })["catch"](function (err) {
                return console.log(err);
              });

            case 22:
              query = _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category,
                  'post.username': search_by_username
                }
              }, {
                $sort: {
                  'post.post_time': -1
                }
              }, {
                $skip: (page - 1) * limit
              }, {
                $limit: limit
              }]);
              _context.next = 28;
              break;

            case 25:
              _context.next = 27;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category
                }
              }]).then(function (result) {
                return total_length = result.length;
              })["catch"](function (err) {
                return console.log(err);
              });

            case 27:
              query = _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category
                }
              }, {
                $sort: {
                  'post.post_time': -1
                }
              }, {
                $skip: (page - 1) * limit
              }, {
                $limit: limit
              }]);

            case 28:
              query.exec().then(function (result) {
                if (endIndex >= total_length) {
                  result.has_next = false;
                } else {
                  result.has_next = true;
                  result.next_page = page + 1;
                }

                if (page === 1) {
                  result.has_prev = false;
                } else {
                  result.has_prev = true;
                  result.prev_page = page - 1;
                }

                attach_likes(result, req.user.name);
                res.render('index', {
                  posts: result,
                  url: current_url,
                  viewername: req.user.name,
                  category: category,
                  user: req.user
                });
              })["catch"](function (err) {
                return console.log(err);
              });

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function renderPost(_x, _x2) {
      return _renderPost.apply(this, arguments);
    }

    return renderPost;
  }(),
  getdata: function () {
    var _getdata = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
      var current_url, data;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              current_url = decodeURIComponent(req.query.current_url);
              data = {};
              data.fav = false;
              _context2.next = 5;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': 'question'
                }
              }]).then(function (result) {
                data.question = result.length;
              });

            case 5:
              _context2.next = 7;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': 'admin'
                }
              }]).then(function (result) {
                data.admin = result.length;
              });

            case 7:
              _context2.next = 9;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': 'related'
                }
              }]).then(function (result) {
                data.related = result.length;
              });

            case 9:
              _context2.next = 11;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': 'others'
                }
              }]).then(function (result) {
                data.others = result.length;
              });

            case 11:
              _context2.next = 13;
              return _post["default"].findOne({
                url: current_url
              }).then(function (result) {
                if (result) {
                  result.favourite_users.forEach(function (elem) {
                    if (elem === req.user.name) {
                      data.fav = true;
                    }
                  });
                }

                ;
              });

            case 13:
              res.status(200).send(data);

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function getdata(_x3, _x4) {
      return _getdata.apply(this, arguments);
    }

    return getdata;
  }(),
  updateLike: function () {
    var _updateLike = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
      var current_url, post_id, like_search_result, add_like, delete_like;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              current_url = decodeURIComponent(req.query.current_url);
              post_id = req.query.post_id;
              like_search_result = {};

              add_like = function add_like(url, id, name) {
                _post["default"].findOneAndUpdate({
                  url: url,
                  "post._id": id
                }, {
                  "$push": {
                    "post.$.upvote_users": {
                      upvote_username: name
                    }
                  }
                }, {
                  "new": true
                }).then(function (result) {
                  res.send('liked');
                })["catch"](function (err) {
                  return console.log(err);
                });
              };

              delete_like = function delete_like(url, id, name) {
                _post["default"].findOneAndUpdate({
                  url: url,
                  "post._id": id
                }, {
                  "$pull": {
                    "post.$.upvote_users": {
                      upvote_username: name
                    }
                  }
                }, {
                  "new": true
                }).then(function (result) {
                  res.send('unliked');
                })["catch"](function (err) {
                  return console.log(err);
                });
              };

              _context3.next = 7;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post._id': (0, _mongodb.ObjectId)(post_id)
                }
              }, {
                $unwind: '$post.upvote_users'
              }, {
                $match: {
                  'post.upvote_users.upvote_username': req.user.name
                }
              }]).then(function (result) {
                like_search_result[req.user.name] = result;

                if (like_search_result[req.user.name].length === 0) {
                  add_like(current_url, post_id, req.user.name);
                } else {
                  delete_like(current_url, post_id, req.user.name);
                }

                ;
                delete like_search_result[req.user.name];
              })["catch"](function (err) {
                return console.log(err);
              });

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function updateLike(_x5, _x6) {
      return _updateLike.apply(this, arguments);
    }

    return updateLike;
  }(),
  getTrendingTags: function () {
    var _getTrendingTags = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
      var current_url, category, final_result;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              current_url = decodeURIComponent(req.query.current_url);
              category = req.query.category;
              final_result = {};
              _context4.next = 5;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category
                }
              }, {
                $match: {
                  'post.post_tags': {
                    "$exists": true,
                    "$ne": null
                  }
                }
              }, {
                $unwind: '$post.post_tags'
              }, {
                $group: {
                  '_id': {
                    'post_tags': '$post.post_tags'
                  },
                  'count': {
                    '$sum': 1
                  }
                }
              }]).then(function (result) {
                result.forEach(function (element) {
                  final_result[element._id.post_tags] = element.count;
                });
              })["catch"](function (err) {
                return console.log(err);
              });

            case 5:
              _context4.next = 7;
              return _post["default"].aggregate([{
                $match: {
                  url: current_url
                }
              }, {
                $unwind: '$post'
              }, {
                $match: {
                  'post.category': category
                }
              }, {
                $unwind: '$post.comments'
              }, {
                $match: {
                  'post.comments.comment_tags': {
                    "$exists": true,
                    "$ne": null
                  }
                }
              }, {
                $unwind: '$post.comments.comment_tags'
              }, {
                $group: {
                  '_id': {
                    'comment_tags': '$post.comments.comment_tags'
                  },
                  'count': {
                    '$sum': 1
                  }
                }
              }]).then(function (result) {
                result.forEach(function (element) {
                  if (!final_result[element._id.comment_tags]) {
                    final_result[element._id.comment_tags] = element.count;
                  } else {
                    final_result[element._id.comment_tags] += element.count;
                  }
                });
                var sortable = [];

                for (var _result in final_result) {
                  sortable.push([_result, final_result[_result]]);
                }

                sortable.sort(function (a, b) {
                  return b[1] - a[1];
                });
                var final_str = '<ul class="list-group">';
                sortable = sortable.slice(0, 10);

                for (var i = 0; i < sortable.length; i += 1) {
                  final_str += '<li class="list-group-item d-flex justify-content-between align-items-center">' + sortable[i][0] + "<span class=\"badge badge-primary badge-pill\">".concat(sortable[i][1], "</span></li>");
                }

                final_str += '</ul>';
                res.send(final_str);
              })["catch"](function (err) {
                return console.log(err);
              });

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function getTrendingTags(_x7, _x8) {
      return _getTrendingTags.apply(this, arguments);
    }

    return getTrendingTags;
  }(),
  favouriteUsers: function () {
    var _favouriteUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
      var username, url, flag;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // console.log(req.body);
              username = req.user.name;
              url = req.body.current_url;
              flag = false;
              _context5.next = 5;
              return _post["default"].findOne({
                url: url
              }).then(function (result) {
                // console.log('result findOne', result.favourite_users);
                if (result) {
                  result.favourite_users.forEach(function (elem) {
                    if (elem === username) {
                      flag = true;
                    }
                  });
                }

                ;
              });

            case 5:
              if (flag) {
                // console.log('inside if --> ', flag);
                _post["default"].findOneAndUpdate({
                  url: url
                }, {
                  "$pull": {
                    "favourite_users": username
                  }
                }, {
                  "new": true
                }).then(function () {
                  _user["default"].removeFavourites(username, url);

                  console.log("".concat(username, " removed from ").concat(url, " favourites!!!"));
                  res.send("removed from favourites!!!");
                })["catch"](function (err) {
                  return console.log(err);
                });
              } else {
                // console.log('inside else --> ', flag);
                _post["default"].findOneAndUpdate({
                  url: url
                }, {
                  "$push": {
                    "favourite_users": username
                  }
                }, {
                  upsert: true
                }).then(function () {
                  _user["default"].addFavourites(username, url);

                  console.log("".concat(username, " added to ").concat(url, " favourites!!!"));
                  res.send("added to favourites!!!");
                })["catch"](function (err) {
                  return console.log(err);
                });
              }

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    function favouriteUsers(_x9, _x10) {
      return _favouriteUsers.apply(this, arguments);
    }

    return favouriteUsers;
  }()
};
module.exports = {
  post_controller: post_controller,
  app: app
};

function attach_likes(result, name) {
  var post_outer;

  var _iterator = _createForOfIteratorHelper(result),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      post_outer = _step.value;
      post_outer.post.user_like = false;
      post_outer.post.like_count = post_outer.post.upvote_users.length;
      var user = void 0;

      var _iterator2 = _createForOfIteratorHelper(post_outer.post.upvote_users),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          user = _step2.value;

          if (user.upvote_username === name) {
            post_outer.post.user_like = true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
//# sourceMappingURL=post.controller.js.map