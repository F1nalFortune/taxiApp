var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var internetAvailable = require("internet-available");
var stripe = require('stripe')(process.env.STRIPE_KEY);

/* GET home page. */
router.get('/home_screen', (req, res) => {
  res.render('user/home_screen', {
    title: 'Map',
    user: req.user
  })
})

router.get('/drivers/all-drivers', (req, res) => {
  User.find({driver: true}, function(err, users){
    res.send(users);
  })
})

router.get('/', hasInternet, (req, res, next) =>  {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/enter_mobile', hasInternet, function(req, res){
  res.render('verify_user/enter_mobile', {
    title: 'Enter Mobile',
    user: req.user
  })
})

router.post('/submit-phone/', hasInternet, function(req, res){
  var phone = req.body.phone;
})

router.get('/billing/', hasInternet, function(req, res){
  (async () => {
    const intent = await stripe.setupIntents.create({
      usage: 'on_session', // The default usage is off_session
    })
    res.render('billing', {
      user: req.user,
      client_secret: intent.client_secret
    })
  })();

})

module.exports = router;

function hasInternet(req, res, next){
  internetAvailable().then(function(){
    console.log("Internet available");
    next();
  }).catch(function(){
    //TODO
    //display a 'CONNECTION ERROR'
    console.log("Houston we have a problem")
    res.render("require_internet.ejs", {
      title: 'Connection Error',
      user: req.user
    })
  });
}
