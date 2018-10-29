const request = require('supertest');
const app = require('../index');
const expect = require('chai').expect;
const db = require('../db');
const { User, Transaction, Stock } = require('../db/models');
const agent = request.agent(app);

describe('API routes', () => {
  let users = [
    {
      id: 1,
      name: 'Isaias',
      email: 'imp@email.com',
      password: '12345'
    },
    {
      id: 2,
      name: 'Alice',
      email: 'alice@email.com',
      password: '54321'
    }
  ];
  const transactions = [
    { symbol: 'AAPL', price: 200, quantity: 1 },
    { symbol: 'GE', price: 10, quantity: 2 },
    { symbol: 'AAPL', price: 200, quantity: 1 },
    { symbol: 'NFLX', price: 100, quantity: 3 }
  ];

  before(() => {
    return db
      .sync({ force: true })
      .then(() => users.forEach(elem => User.create(elem)));
  });

  describe('POST /api/transactions route', () => {
    it('can make a transaction', () => {
      return agent
        .post('/auth/login')
        .send(users[0])
        .set('Accept', 'application/json')
        .then(() => {
          return agent
            .post('/api/transactions')
            .send(transactions[0])
            .set('Accept', 'application/json')
            .then(resp => {
              expect(resp.status).to.equal(201);
              expect(resp.body.updatedStock.symbol).to.equal('AAPL');
              expect(resp.body.updatedStock.quantity).to.equal(1);
            });
        });
    });

    it('updates an existing stock owned by user', () => {
      return agent
        .post('/auth/login')
        .send(users[0])
        .set('Accept', 'application/json')
        .then(() => {
          return agent
            .post('/api/transactions')
            .send(transactions[2])
            .set('Accept', 'application/json')
            .then(resp => {
              expect(resp.status).to.equal(201);
              expect(resp.body.updatedStock[1].symbol).to.equal('AAPL');
              expect(resp.body.updatedStock[1].quantity).to.equal(2);
            });
        });
    });

    it('handle multiple users owning their own stocks', () => {
      return agent
        .post('/auth/login')
        .send(users[1])
        .set('Accept', 'application/json')
        .then(() => {
          return agent
            .post('/api/transactions')
            .send(transactions[1])
            .set('Accept', 'application/json')
            .then(resp => {
              expect(resp.status).to.equal(201);
              expect(resp.body.updatedStock.symbol).to.equal('GE');
              expect(resp.body.updatedStock.quantity).to.equal(2);
            });
        })
        .then(() => {
          return agent
            .post('/api/transactions')
            .send(transactions[3])
            .set('Accept', 'application/json')
            .then(resp => {
              expect(resp.status).to.equal(201);
              expect(resp.body.updatedStock.symbol).to.equal('NFLX');
              expect(resp.body.updatedStock.quantity).to.equal(3);
            });
        })
        .then(() => {
          return Stock.findAll({ where: { userId: users[0].id } }).then(
            elem => {
              expect(elem.length).to.equal(1);
              expect(elem[0].quantity).to.equal(2);
            }
          );
        })
        .then(() => {
          return Stock.findAll({ where: { userId: users[1].id } }).then(
            elem => {
              expect(elem.length).to.equal(2);
              expect(elem[0].quantity).to.equal(2);
              expect(elem[1].quantity).to.equal(3);
            }
          );
        });
    });
  });

  describe('GET /api/stocks route', () => {
    it('gets stocks of currently logged in user', () => {
      return agent
        .post('/auth/login')
        .send(users[1])
        .set('Accept', 'application/json')
        .then(() => {
          return agent.get('/api/stocks').then(resp => {
            expect(resp.status).to.equal(200);
            expect(resp.body.length).to.equal(2);
          });
        });
    });
  });

});
