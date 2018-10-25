const Sequelize = require('sequelize');
const crypto = require('crypto');
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
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5, 100]
    },
    get() {
      return () => this.getDataValue('password');
    }
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt');
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

User.prototype.isCorrectPassword = function(password) {
  return User.encryptPassword(password, this.salt()) === this.password()
};

User.generateSalt = () => crypto.randomBytes(16).toString('base64');
User.encryptPassword = (plaintext, salt) =>
  crypto
    .createHash('RSA-SHA256')
    .update(plaintext)
    .update(salt)
    .digest('hex');

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);

module.exports = User;
