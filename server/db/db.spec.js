const Sequelize = require('sequelize');
const name = require('../../package.json').name;
const expect = require('chai').expect;

const databaseName = name + (process.env.NODE_ENV === 'test' ? '-test' : '');

describe('db', () => {
  it('can connect to database', () => {
    const db = new Sequelize(
      process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
      { logging: false }
    );

    db.sync(({ config }) => {
      expect(config.databasename).to.equal('stockportfolio-test');
    });
  });
});
