var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequel = require('../config/sequel')
const passport = require('passport')
require('dotenv').config()


var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var authRouter = require('../routes/auth')


main()

async function main (){
  try {
    await sequel.sync({force : false})
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

var app = express();


// view engine setup
app.set('views', path.join(__dirname, '..','views'));
app.set('view engine', 'ejs');

require('../config/passport')(passport);

app.use(passport.initialize())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/auth/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.listen(3000, ()=>{
  console.log('Server started on port 3000')
})

module.exports = app;
