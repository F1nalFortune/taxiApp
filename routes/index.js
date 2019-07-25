var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var internetAvailable = require("internet-available");
const stripePublishable = process.env.STRIPE_PUBLISHABLE;
const stripeSecret = process.env.STRIPE_SECRET;
const stripe = require("stripe")("sk_test_n3FpdK0lt1zNZX1K8MKCJkFX00ZicQ9rSU");

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
  if(req.user.customerId){
    var customer = req.user.customerId;
  } else {
    var customer = false;
  }
  const setupIntent = stripe.setupIntents.create({
    usage: 'on_session', // The default usage is off_session
  })
  .then(setupIntent =>
    res.render('user/billing', {
      user: req.user,
      client_secret: setupIntent.client_secret,
      customer: customer,
      intent_id: setupIntent.id
    })
  )
})

router.get('/list-cards', function(req, res){
  stripe.paymentMethods.list(
    { customer: req.user.customerId, type: "card" },
    function(err, paymentMethods) {
      res.send(paymentMethods)
    }
  );
})

router.get('/create-paymentmethod/:id', function(req, res){
  var id = req.params.id;
  stripe.setupIntents.retrieve(
    id,
    function(err, setupIntent) {
      if(err){
        console.log(err)
      }
      const paymentMethod = stripe.paymentMethods.attach(
        setupIntent.payment_method,
        {
          customer: req.user.customerId,
        }
      )
      .then(paymentMethod =>
        // req.flash('success_update', 'Success! Your card has been updated.')
        res.send(paymentMethod))
    }
  );
})

router.get('/create-customer/:id', function(req, res){
  var id = req.params.id;
  stripe.setupIntents.retrieve(
    id,
    function(err, setupIntent) {
      if(err){
        console.log(err)
      }
      const customer = stripe.customers.create({
        payment_method: setupIntent.payment_method,
      })
      .then(customer =>
        User.findById(req.user.id, function(err, user){
          user.customerId = customer.id;
          user.save(function(err, user){
            if(err){
              console.log(err)
            }
            req.flash('success_add', 'Success! Your card has been added.');
            res.sendStatus(200)
          })
        }))
    }
  );
})

// router.get('/update-customerid', function(req, res){
//   User.findById(req.user.id, function(err, user){
//     user.customerId =
//   })
// })
// router.post("/add-creditcard", (req, res) => {
//
//   (async () => {
//     if(req.user.customerId){
//       stripe.customers.update(req.user.customerId, {
//         source: req.body.stripeToken,
//       });
//     } else {
//       // Create a Customer:
//       const customer = await stripe.customers.create({
//         source: req.body.stripeToken,
//         email: req.user.email
//       });
//
//       User.findById(req.user.id, function(err, user){
//         user.customerId = customer.id;
//         user.save(function(err, user){
//           req.flash('success', 'Success! You have successfully added a new card.')
//           res.send(200)
//         })
//       })
//     }
//   })();
// });

router.post("/update-creditcard", (req, res) => {

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
