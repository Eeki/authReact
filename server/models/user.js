const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs'); // We will crypt the user password with bcrypt


//Define our user model
const userSchema = new Schema({
  email : { type: String, unique: true, lowercase: true }, //email is unique. Before the mongoose will save the userSchema to DB, it checks if the email is unique.
  password: String
});

//On Save Hook, encrypt password
//Before saving the model, run this function
userSchema.pre('save', function(next) {
  const user = this; // The contect is the user model, so this is just to get access to the user model instance.

  // generate a salt then run callback (generating salt will take time)
  bcrypt.genSalt(10, function(err, salt) {
    if(err) {
       return next(err);
      }
    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) {
        return next(err);
      }
      // overwrite palin text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  console.log("comparing passwords");
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) {
      return callback(err)
    }
    callback(null, isMatch)
  })
};

//Create the model class
const ModelClass = mongoose.model('user', userSchema); // All users

//Export the model
module.exports = ModelClass;

//the password that is saved (long string) contains both hash ( salt hashed password) and the salt.