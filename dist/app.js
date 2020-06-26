"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _hbs = _interopRequireDefault(require("hbs"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _home = _interopRequireDefault(require("./routes/home"));

var _users = _interopRequireDefault(require("./routes/users"));

var _post = _interopRequireDefault(require("./routes/post"));

_dotenv["default"].config();

_hbs["default"].registerHelper('URL', function () {
  if (process.env.NODE_ENV === 'devlopment') {
    return 'http://localhost:3000';
  } else {
    return 'https://candor-app.herokuapp.com';
  }
});

_hbs["default"].registerHelper("printDate", function (date_before) {
  var dateUTC = new Date(date_before); // dateUTC = dateUTC.getTime();

  var curr_date = new Date();
  var diff = curr_date - dateUTC;
  var seconds = parseInt(diff / 1000);
  var minutes = parseInt(seconds / 60);
  var hours = parseInt(minutes / 60);
  var days = parseInt(hours / 24);

  if (days >= 1) {
    if (days == 1) {
      return days + " day ago";
    }

    return days + " days ago";
  } else if (hours >= 1) {
    if (hours == 1) {
      return "one hour ago";
    }

    return hours + " hours ago";
  } else if (minutes >= 1) {
    if (minutes == 1) {
      return "one minute ago";
    }

    return minutes + " minutes ago";
  } else {
    return "less than a minute ago";
  } // return diff.toString();
  // let dateIST = new Date(dateUTC);
  // //date shifting for IST timezone (+5 hours and 30 minutes)
  // dateIST.setHours(dateIST.getHours() + 5);
  // dateIST.setMinutes(dateIST.getMinutes() + 30);
  // return dateIST.toString();

});

_mongoose["default"].connect(process.env.mongo_uri, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(console.log('DB connected successfully'))["catch"](function (err) {
  return console.log(err);
});

var app = (0, _express["default"])(); // view engine setup

app.set('views', _path["default"].join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'public')));
app.use('/', _home["default"]);
app.use('/users', _users["default"]);
app.use('/post', _post["default"]); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
//# sourceMappingURL=app.js.map