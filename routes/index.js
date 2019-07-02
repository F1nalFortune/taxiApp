var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) =>  {
  res.render('index.ejs', { title: 'Express', user: req.user });
});

router.get('/enter_mobile', function(req, res){
  res.render('enter_mobile.ejs', {
    title: 'Enter Mobile',
    user: req.user
  })
})

router.post('/submit-phone/', function(req, res){
  var phone = req.body.phone;

})


module.exports = router;
