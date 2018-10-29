const router = require('express').Router();
const { User } = require('../db/models');

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        res.json({ message: 'Incorrect email.' });
        return;
      }
      if (!user.isCorrectPassword(password)) {
        res.json({ message: 'Incorrect password.' });
        return;
      }

      req.login(user, err => {
        err ? next(err) : res.json(user);
      });
    })
    .catch(err => next(err));
});

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
        err ? next(err) : res.status(201).json(user);
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
