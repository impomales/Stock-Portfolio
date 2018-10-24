const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const app = express();

if (process.env.NODE_ENV !== 'production') require('../secrets');

// logging middleware
app.use(morgan('dev'));

// api routes
app.use('/api', require('./api'));

// parse http responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public/index.html')));


db.sync().then(({ config }) => {
  console.log(`successfully connected to database: ${config.database}`)
  console.log();
  app.listen(8080, () => {
    console.log(`app listening on port: ${process.env.PORT}`);
  });
});


