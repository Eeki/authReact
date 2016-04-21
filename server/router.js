const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false});


module.exports = function(app) { //module.export --> node way to export
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret code is ABC123'})
  });

  app.post('/signin',requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
  
};

// req -> incoming http request, res -> response we are sending back, next -> mostly for error handling will be more later


