require('dotenv').config()
const express = require('express');
const router = express.Router();
const Nexmo = require('nexmo');
const User = require('../models/user');

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET,
  applicationId: process.env.NEXMO_ID,
  privateKey: process.env.NEXMO_PKEY
});

router.get('/verify',(req,res)=>{
  res.render('verify_user/verify');
});


router.post('/confirm', (req, res) => {
  // Checking to see if the code matches
  let pin = req.body.pin;
  let requestId = req.body.requestId;
  let phone = req.body.phone;
  var numberPattern = /\d+/g;
  var phoneNumber = "1" + req.body.phone.match(numberPattern).join("")
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
          res.render('create_user/ask_email',{
            title: 'Create User',
            phone: phoneNumber,
          })
        }
        //res.status(200).send('Account verified!');
        // User.find({mobile: phoneNumber}, function(err, user){
        //   if(user){
        //     //welcome back screen
        //   }else{
        //     res.render('verify_user/status', {message: 'Account verified! 🎉', phone: phoneNumber});
        //   }
        // })
        res.render('verify_user/status', {message: 'Account verified! 🎉', phone: phoneNumber});
      } else {
        //res.status(401).send(result.error_text);
        res.render('verify_user/status', {message: result.error_text, requestId: requestId, phone: phoneNumber});
      }
    }
  });
});


module.exports = router;
