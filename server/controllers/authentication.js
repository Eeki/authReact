const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already their email and password auth's. We just need to give them a token
  // we can get the user from req.user because user is passed to password 'next' callback that puts user to req.
  console.log(req.user);
  res.send( {token: tokenForUser(req.user)} )
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  console.log("signup");
  if(!email || !password) { // add here a check that email is valid and password is long enough
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if(err) {
      return next(err);
    }
    //If a user with email does exist, return an error
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use'});     //res.status() <- set response code
    }

    //If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if(err) {
        return next(err);
      }

      //Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) }); // Response to the client will be a generated accessToken

    });
  });
};

//Lisätietoa jwt:stä (json web token) osoitteessa: https://jwt.io/