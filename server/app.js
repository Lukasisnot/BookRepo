var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:adminadmin@cluster0.nzkkh.mongodb.net/book_repo?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("Database connected"))
.catch((err) => console.log(err));

var indexRouter = require('./routes/index');
var catsRouter = require('./routes/cats');
var periodRouter = require('./routes/period');
var literaryGroupRouter = require('./routes/LiteraryGroup');
var authorRouter = require('./routes/author');
var bookRouter = require('./routes/book');
var userRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));

const allowedOrigins = [
  'http://localhost:3000', // Your React frontend development server
  'http://localhost:5173', // Vite's default dev server port (if you use Vite)
  // Add your production frontend URL here if applicable
  // e.g., 'https://your-frontend-app.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // <-- THIS IS CRUCIAL for allowing cookies
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/cats', catsRouter);
app.use('/api/period', periodRouter);
app.use('/api/literary-group', literaryGroupRouter);
app.use('/api/author', authorRouter);
app.use('/api/book', bookRouter);
app.use('/api/user', userRouter);

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