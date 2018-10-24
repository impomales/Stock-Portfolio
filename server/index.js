const express = require('express');
const db = require('./db');
const app = express();

if (process.env.NODE_ENV !== 'production') require('../secrets');

app.get('/', (req, res) => res.status(200).send('stock app'));


db.sync().then(({ config }) => {
  console.log(`successfully connected to database: ${config.database}`)
  console.log();
  app.listen(8080, () => {
    console.log(`app listening on port: ${process.env.PORT}`);
  });
});


