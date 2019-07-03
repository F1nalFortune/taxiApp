var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var back = require('express-back');
var internetAvailable = require("internet-available");

internetAvailable().then(function(){
  console.log("Internet available");
}).catch(function(){
  //TODO
  //display a 'CONNECTION ERROR'
  console.log("Houston we have a problem")
});

var routes = require('./routes/index');
var register = require('./routes/register')
var verify = require('./routes/verify');
var status = require('./routes/status');
// var users = require('./routes/users');

var app = express();

// view engine setup
var engines = require('consolidate');

// app.engine('html', engines.ejs);
app.set('view engine', 'ejs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// PASSPORT STUFF
app.use(require('express-session')({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: false
}));
// app.use back has to go after express-session STUFF
app.use(back());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use(register);
app.use(verify);
app.use(status);
// app.use('/users', users);

// add authenticate method
var User = require('./models/user');
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// mongoose.Promise = global.Promise;
// Local Strat needs a model.
// Connect to database
mongoose.connect('mongodb://localhost/toads-taxi', {useNewUrlParser: true});
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
