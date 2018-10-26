const router = require('express').Router();
const { User, Transaction, Stock } = require('../db/models');
const Op = require('sequelize').Op;

// router.get('/transactions', (req, res, next) => {TODO});

// router.get('/portfolio', (req, res, next) => {TODO});

router.post('/transactions', (req, res, next) => {
  const { symbol, price, quantity } = req.body;

  if (!req.user) {
    res.status(403).json({ message: 'FORBIDDEN' });
    return;
  }

  // create a new transaction for current user.
  Transaction.create({ symbol, quantity, price, userId: req.user.id })
    .then(transaction => {
      console.log('transaction successfully saved: ', transaction.id);

      Stock.findOne({
        where: {
          [Op.and]: [{ symbol }, { userId: req.user.id }]
        }
      }).then(stock => {
        // not found, create new stock in portfolio.
        if (!stock) {
          Stock.create({ symbol, quantity, userId: req.user.id })
            .then(updatedStock => {
              console.log('portfolio successfully updated');
              res.json({ transaction, updatedStock });
            })
            .catch(err => next(err));
        } else {
          // if found, update quantity of stock in portfolio.
          Stock.update(
            { quantity: +stock.quantity + +quantity },
            {
              where: {
                [Op.and]: [{ symbol }, { userId: req.user.id }]
              },
              returning: true,
              plain: true
            }
          )
            .then(updatedStock => {
              console.log('portfolio successfully updated');
              res.json({ transaction, updatedStock });
            })
            .catch(err => next(err));
        }
      });
    })
    .catch(err => next(err));
});

module.exports = router;
