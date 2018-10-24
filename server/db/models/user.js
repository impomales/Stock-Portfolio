const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('User', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5, 100]
    }
  },
  balance: {
    type: Sequelize.INTEGER,
    defaultValue: 500000, // in pennies.
    validate: {
      min: 0
    }
  }
});

module.exports = User;
