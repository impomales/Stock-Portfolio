const request = require('supertest');
const app = require('../index');
const expect = require('chai').expect;
const db = require('../db');
const { User } = require('../db/models');
const agent = request.agent(app);

describe('AUTH routes', () => {
  let user = {
    name: 'Isaias',
    email: 'imp@email.com',
    password: '12345'
  };


  before(() => {
     return db.sync({ force: true }).then(() => User.create(user));
  });

  describe('POST /auth/login route', () => {
    it('can log in a user', () => {
      agent
        .post('/auth/login')
        .send(user)
        .set('Accept', 'application/json')
        .then(resp => expect(resp.body.name).to.equal('Isaias'))
    });
  });

  describe('POST /auth/logout route', () => {
    it('can log out a user and redirects', () => {
      agent
        .post('/auth/logout')
        .then(resp => {
          expect(resp.status).to.equal(302);
        });
    })
  });

  describe('POST /auth/signup route', () => {
    const user2 = {
      name: 'Alice',
      email: 'alice@email.com',
      password: '54321'
    };

    it('can create a new user', () => {
      agent
        .post('/auth/signup')
        .send(user2)
        .set('Accept', 'application/json')
        .then(resp => {
          expect(resp.status).to.equal(201);
        });
    })
  })
});
