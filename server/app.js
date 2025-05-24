var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:adminadmin@cluster0.zymn1.mongodb.net/bohata?retryWrites=true&w=majority')
.then(() => console.log("Database connected"))
.catch((err) => console.log(err));

var indexRouter = require('./routes/index');
var catsRouter = require('./routes/cats');
var periodRouter = require('./routes/period');
var literaryGroupRouter = require('./routes/LiteraryGroup');



var app = express();



app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/cats', catsRouter);
app.use('/api/period', periodRouter);
app.use('/api/literary-group', literaryGroupRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
