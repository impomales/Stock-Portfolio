const passport = require('passport');
const LocalStrategy = require('passport-local');
const router = require('express').Router();
const { User } = require('../db/models');

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password'
//     },
//     (email, password, done) => {
//       User.findOne({ where: { email } })
//         .then(user => {
//           console.log('helo')
//           if (!user)
//             return done(null, false, {
//               message: 'Incorrect email.'
//             });
//           if (!user.isCorrectPassword(password))
//             return done(null, false, {
//               message: 'Invalid password.'
//             });

//           return done(null, user);
//         })
//         .catch(err => done(err));
//     }
//   )
// );

router.post(
  '/login',
  (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({where: { email }})
      .then(user => {
        if (!user) {
          res.json({message: 'Incorrect email.'});
          return;
        }
        if (!user.isCorrectPassword(password)) {
          res.json({message: 'Incorrect password.'});
          return;
        }

        req.login(user, err => {
          err ? next(err) : res.json(user);
        });
      })
      .catch(err => next(err));
  }
);

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

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
