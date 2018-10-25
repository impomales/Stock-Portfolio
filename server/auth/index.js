const router = require('express').Router();
const { User } = require('../db/models');

// used for debugging.
// router.get('/', (req, res, next) => {
//   User.findAll({
//     attributes: ['email', 'id']
//   }).then(users => res.json(users));
// })

router.post('/', (req, res, next) => {

});

router.use('/local', require('./local'))

module.exports = router;
