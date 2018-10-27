const User = require('./user');
const Transaction = require('./transaction');
const Stock = require('./stock');

// define relationships here.
Transaction.belongsTo(User);
User.hasMany(Transaction);

Stock.belongsTo(User);
User.hasMany(Stock);

module.exports = { User, Transaction, Stock };
