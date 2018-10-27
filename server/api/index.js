const router = require('express').Router();
const { User, Transaction, Stock } = require('../db/models');
const Op = require('sequelize').Op;

router.get('/stocks', (req, res, next) => {
  if (!req.user) {
    res.status(403).json({ message: 'FORBIDDEN' });
    return;
  }

  Stock.findAll({ where: { userId: req.user.id } })
    .then(stocks => res.json(stocks))
    .catch(err => next(err));
});

router.get('/transactions', (req, res, next) => {
  if (!req.user) {
    res.status(403).json({ message: 'FORBIDDEN' });
    return;
  }

  Transaction.findAll({ where: { userId: req.user.id } })
    .then(transactions => res.json(transactions))
    .catch(err => next(err));
});

router.post('/transactions', (req, res, next) => {
  const { symbol, price, quantity } = req.body;

  if (!req.user) {
    res.status(403).json({ message: 'FORBIDDEN' });
    return;
  }

  // create a new transaction for current user.
  Transaction.create({ symbol, quantity, price, userId: req.user.id })
    .then(() => {
      console.log('transaction successfully saved');
      return User.update(
        { balance: req.user.balance - quantity * price },
        {
          where: { id: req.user.id },
          returning: true,
          plain: true
        }
      );
    })
    .then(() => {
      console.log('user successfully updated');

      return Stock.findOne({
        where: {
          [Op.and]: [{ symbol }, { userId: req.user.id }]
        }
      });
    })
    .then(stock => {
      // not found, create new stock in portfolio.
      if (!stock) {
        return Stock.create({ symbol, quantity, userId: req.user.id });
      } else {
        // if found, update quantity of stock in portfolio.
        return Stock.update(
          { quantity: +stock.quantity + +quantity },
          {
            where: {
              [Op.and]: [{ symbol }, { userId: req.user.id }]
            },
            returning: true,
            plain: true
          }
        );
      }
    })
    .then(updatedStock => {
      console.log('portfolio successfully updated');
      res.json({ updatedStock });
      return null;
    })
    .catch(err => next(err));
});

module.exports = router;
