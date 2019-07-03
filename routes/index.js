var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var internetAvailable = require("internet-available");

/* GET home page. */
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
