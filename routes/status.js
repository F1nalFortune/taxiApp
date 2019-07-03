const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/status', function(req, res, next) {
  res.render('verify_user/status');
});

module.exports = router;
