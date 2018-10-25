const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const { User } = require('./db/models');
const app = express();

if (process.env.NODE_ENV !== 'production') require('../secrets');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// logging middleware
app.use(morgan('dev'));

// parse http responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// auth set up
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'this is a secret',
    saveUninitialized: false,
    resave: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', require('./auth'));

// html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
);

db.sync().then(({ config }) => {
  console.log(`successfully connected to database: ${config.database}`);
  app.listen(8080, () => {
    console.log(`app listening on port: ${process.env.PORT}`);
  });
});
