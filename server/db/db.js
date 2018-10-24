const Sequelize = require('sequelize');
const name = require('../../package.json').name;

const databaseName = name + (process.env.NODE_ENV === 'test' ? '-test' : '');

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  { logging: false }
);

module.exports = db;
