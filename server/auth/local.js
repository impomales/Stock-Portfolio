const passport = require('passport');
const LocalStrategy = require('passport-local');
const router = require('express').Router();
const { User } = require('../db/models');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(null, false, {
            message: 'Incorrect email.'
          });
        if (!user.validPassword(password))
          return done(null, false, {
            message: 'Invalid password.'
          });
      });
    }
  )
);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router;
