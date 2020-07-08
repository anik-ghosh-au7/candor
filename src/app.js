import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import handlebars from 'hbs';
import dotenv from 'dotenv';
dotenv.config();

handlebars.registerHelper('URL',()=>{
    if(process.env.NODE_ENV === 'devlopment'){
        return 'http://localhost:3000'
    }else{
        return 'https://candor-app.herokuapp.com'
    }
})
handlebars.registerHelper("printDate", function(date_before) {

    let dateUTC = new Date(date_before);
    let curr_date= Date.now();
    let diff= curr_date-dateUTC;

    let  seconds = parseInt(diff / 1000);
    let minutes = parseInt(seconds / 60);
    let hours = parseInt(minutes / 60);
    let days = parseInt(hours / 24);
    if(days>=1){
        if(days==1){
            return days+" day ago"
        }
        return days+" days ago"
    }else if(hours>=1){
        if(hours==1){
            return "one hour ago"
        }
        return hours+" hours ago"
    }else if(minutes>=1){
        if(minutes==1){
            return  "one minute ago"
        }
        return minutes +" minutes ago"
    }else{
        return "less than a minute ago"
    }
    // return diff.toString();
    // let dateIST = new Date(dateUTC);
    // //date shifting for IST timezone (+5 hours and 30 minutes)
    // dateIST.setHours(dateIST.getHours() + 5);
    // dateIST.setMinutes(dateIST.getMinutes() + 30);
    // return dateIST.toString();
});
handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});
mongoose.connect(process.env.mongo_uri, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(console.log('DB connected successfully'))
    .catch(err => console.log(err));

import homeRouter from './routes/home';
import usersRouter from './routes/users';
import postRouter from './routes/post';
import chatRouter from './routes/chat';
import messageRouter from './routes/message';

const app = express();

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
app.use('/chat', chatRouter);
app.use('/messages',messageRouter);

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
