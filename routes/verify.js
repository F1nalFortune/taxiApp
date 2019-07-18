require('dotenv').config()
const express = require('express');
const router = express.Router();
const Nexmo = require('nexmo');
const User = require('../models/user');
var mongoose = require('mongoose');
var stripe = require('stripe')(process.env.STRIPE_KEY);
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         console.log('incorrect username')
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (user.password != password) {
//         console.log('incorrect password')
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET,
  applicationId: process.env.NEXMO_ID,
  privateKey: process.env.NEXMO_PKEY
});

router.get('/verify',(req,res)=>{
  res.render('verify_user/verify');
});


router.post('/confirm', (req, res, next) => {
  // Checking to see if the code matches
  let pin = req.body.pin;
  let requestId = req.body.requestId;
  let phone = req.body.phone;
  var numberPattern = /\d+/g;
  var phoneNumber = req.body.phone.match(numberPattern).join("")
console.log('value of requestid in verify post handler is ' + requestId);
  nexmo.verify.check({request_id: requestId, code: pin}, async (err, result) => {
    if(err) {
      //res.status(500).send(err);
      res.render('verify_user/status', {message: 'Server Error', phone: phoneNumber});
    } else {
      console.log(result);
      // Error status code: https://docs.nexmo.com/verify/api-reference/api-reference#check
      if(result && result.status == '0') {
        var number = await User.find({mobile:phoneNumber})
        if(number.length==0){
          res.render('create_user/create_user',{
            title: 'Create User',
            phone: phoneNumber,
          })
        } else {
          return res.render('user/login', {
            phoneNumber: phoneNumber,
            data: {},
            errors: {}
          });
        }
        //res.status(200).send('Account verified!');
        // User.find({mobile: phoneNumber}, function(err, user){
        //   if(user){
        //     //welcome back screen
        //   }else{
        //     res.render('verify_user/status', {message: 'Account verified! 🎉', phone: phoneNumber});
        //   }
        // })
      } else {
        //res.status(401).send(result.error_text);
        res.render('verify_user/status', {message: result.error_text, requestId: requestId, phone: phoneNumber});
      }
    }
  });
});

router.get('/get-username/:id', function(req, res){
  var number = req.params.id;
  User.find({mobile: number}, function(err, user){
    var username = user.username;
    res.send(user);
  })
})

router.get('/login/', (req, res) => {
  if (req.isAuthenticated()){
    res.render('user/home_screen', {
      user: req.user
    })
  }
 res.render('user/login.ejs', {
   user: req.user,
   data: {},
   errors: {}
   // csrfToken: req.csrfToken()
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// router.post('/login',
//   passport.authenticate('local', { successRedirect: '/home_screen',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
      return res.render('user/login.ejs', {
        data: req.body,
        user: req.user,
        errors: {
          valid: {
            msg: 'Incorrect credentials'
          }
        }
        // csrfToken: req.csrfToken()
      })
    }
    req.logIn(user, function(err) {
        if (err) return next(err);
        if(user.driver){
          return res.redirect('/driver/home_screen');
        } else {
          return res.redirect('/home_screen');
        }
      });
    })(req, res, next);
});



module.exports = router;

function isAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/login');
}
