var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const handlebars = require('hbs');


require('dotenv').config();
handlebars.registerHelper('URL',()=>{
    if(process.env.NODE_ENV === 'devlopment'){
        return 'http://localhost:3000'
    }else{
        return 'https://candor-app.herokuapp.com'
    }
})
handlebars.registerHelper("printDate", function(date_before) {

    var dateUTC = new Date(date_before);
    var dateUTC = dateUTC.getTime();
    var dateIST = new Date(dateUTC);
    //date shifting for IST timezone (+5 hours and 30 minutes)
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    return dateIST.toString();
});
mongoose.connect(process.env.mongo_uri, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(console.log('DB connected successfully'))
    .catch(err => console.log(err));

var homeRouter = require('./routes/home');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');

var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/post', postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
