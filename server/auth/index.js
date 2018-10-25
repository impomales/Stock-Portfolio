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
      return User.findOne({ where: { email } })
        .then(user => {
          if (!user)
            return done(null, false, {
              message: 'Incorrect email.'
            });
          if (!user.isCorrectPassword(password))
            return done(null, false, {
              message: 'Invalid password.'
            });

          return done(null, user);
        })
        .catch(err => done(err));
    }
  )
);

// used for debugging.
// router.get('/', (req, res, next) => {
//   User.findAll({
//     attributes: ['email', 'id']
//   }).then(users => res.json(users));
// })

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.post('/signup', (req, res, next) => {
  const { email, password, name } = req.body;

  User.create({ email, password, name })
    .then(user =>
      req.login(user, err => {
        err ? next(err) : res.json(user);
      })
    )
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists.');
      } else next(err);
    });
});

router.get('/me', (req, res, next) => {
  res.json(req.user);
});

module.exports = router;
