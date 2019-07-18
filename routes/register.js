require('dotenv').config()
var express = require('express');
var router = express.Router();
var Nexmo = require('nexmo');
var User = require('../models/user');
// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
var stripe = require('stripe')(process.env.STRIPE_KEY);
var passport = require('passport');



var nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET,
  applicationId: process.env.NEXMO_ID,
  privateKey: process.env.NEXMO_PKEY
});

var ncco = [
  {
    action: 'talk',
    voiceName: 'Salli',
    text:
      'What do you get if you cross a telephone with an iron? A smooth operator!',
  },
];

router.get('/call_code/:number', function(req, res){
  var number =
  nexmo.calls.create(
    {
      to: [{ type: 'phone', number: number }],
      from: { type: 'phone', number: '12035076042' },
      ncco,
    },
    (err, result) => {
      console.log(err || result);
    },
  );
})


router.get('/register_account', function(req, res){
  res.render('register_account', {
    title: 'Create Account'
  })
})


router.post('/register', (req, res) => {
  // A user registers with a mobile phone number
  var numberPattern = /\d+/g;
  var phoneNumber = "1" + req.body.number.match(numberPattern).join("")
  let message = "Your Toad's Taxi"
  console.log(phoneNumber);
  nexmo.verify.request({number: phoneNumber, brand: message}, (err, result) => {
    if(err) {
      //res.sendStatus(500);
      res.render('verify_user/status', {
        message: 'Server Error',
        phone: phoneNumber
      });
    } else {
      console.log(result);
      let requestId = result.request_id;
      if(result.status == '0') {
        res.render('verify_user/verify', {
          requestId: requestId,
          phone: req.body.number
        });
      } else {
        //res.status(401).send(result.error_text);
        res.render('verify_user/status', {
          message: result.error_text,
          requestId: requestId,
          phone: phoneNumber
        });
      }
    }
  });
});

router.post("/create_user", (req, res) => {
  // User.register( new User ({
  //   email: req.body.email,
  //   // password: req.body.password,
  //   first: req.body.first,
  //   last: req.body.last,
  //   mobile: req.body.mobile,
  //   username: req.body.email
  // }), req.body.password, (err, user) => {
  //   if (err)
  //     console.log(err);
  //     return res.render('index', { user: user });
  //   passport.authenticate('local')(req, res, () => {
  //     res.redirect('/home_screen');
  //   });
  // });
  console.log(req.body);
  var user = new User({
    email: req.body.email,
    password: req.body.password,
    first: req.body.first,
    last: req.body.last,
    mobile: req.body.mobile,
    username: req.body.email
  });
  user.save(function(err) {
    console.log(err)
    if (err) { return res.status(500).send({ msg: err.message }); }
    res.redirect('/login');
  });
})


module.exports = router;
