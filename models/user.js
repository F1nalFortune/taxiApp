// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');
//
//
// var User = new Schema({
//   email: { type: String, required: true, unique: true },
//   username: { type: String, unique: true },
//   password: { type: String },
//   //stripe customer id
//   customerId: String,
//   mobile: { type: String, unique: true },
//   first: { type: String, required: true },
//   last: { type: String, required: true },
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   admin: { type: Boolean, default: false },
//   driver: { type: Boolean, default: false },
//   //FOR DRIVERS
//   capacity: { type: String }
// });
//
// // Library assures usernames are unique
// // easy to register new users
// // encrypt passwords
// // new user registration super helper
// User.plugin(passportLocalMongoose);
//
// module.exports = mongoose.model('User', User);


var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
// var nodemailer = require('nodemailer');
// var multer = require("multer");
var LocalStrategy = require('passport-local').Strategy;
// var async = require('async');
var bcrypt = require('bcrypt-nodejs');
// const { check, validationResult } = require('express-validator/check');
// const { matchedData } = require('express-validator/filter');
// var cloudinaryStorage = require('multer-storage-cloudinary');
// var cloudinary = require('cloudinary');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String },
  //stripe customer id
  customerId: String,
  mobile: { type: String, unique: true },
  first: { type: String, required: true },
  last: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  admin: { type: Boolean, default: false },
  driver: { type: Boolean, default: false },
  //FOR DRIVERS
  capacity: { type: String }
});

userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};



userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

var User = mongoose.model('User', userSchema);

passport.use(new LocalStrategy(function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect email.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
