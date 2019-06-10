var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  // or email
  username: String,
  password: String
});

// Library assures usernames are unique
// easy to register new users
// encrypt passwords
// new user registration super helper
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
