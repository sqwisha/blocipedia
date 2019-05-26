const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000';

const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;

describe('routes : user', () => {

  beforeEach((done) => {
    sequelize.sync({force: true})
    .then((res) => {
      done();
    })
    .catch((err) => {
      done();
    });
  });

  describe('GET /', () => {

    it('should return code 200', (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

  });

  describe('GET /users/sign-up', () => {

    it('should display a sign up form', (done) => {
      request.get(`${base}/users/sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Sign up');
        done();
      });
    });

  });

  describe('POST /users/create', () => {

    const options = {
      url: `${base}/users/create`,
      form: {
        name: 'A girl has no name',
        email: 'faceless@braavos.com',
        password: 'thenorthremembers',
        password_conf: 'thenorthremembers'
      }
    };

    it('should create a new user and redirect', (done) => {
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        User.findOne({where: {email: options.form.email}})
        .then((user) => {
          expect(user.name).toBe('A girl has no name');
          expect(user.id).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    it('should not create user with duplicate email', (done) => {
      request.post({
        name: 'Arya Stark',
        email: 'faceless@braavos.com',
        password: 'starkravingawesome',
        password_conf: 'starkravingawesome'
      }, (err, res, body) => {
        User.findOne({where: { name: 'Arya Stark'}})
        .then((user) => {
          // err will skip
          done();
        })
        .catch((err) => {
          expect(err).not.toBeNull();
          done();
        })
      });
    });

    it('should not create a user if password confirmation does not match', (done) => {
      request.post({
        url: `${base}/users/create`,
        form: {
          name: 'A girl has no name',
          email: 'faceless@braavos.com',
          password: 'thenorthremembers',
          password_conf: 'thenorthrememberz'
        }
      }, (err, res, body) => {
        expect(body).toContain('Redirecting to /users/sign_up');
        done();
      });
    });

  });

  describe('GET /users/sign_in', () => {

    beforeEach((done) => {
      User.create({
        name: 'A Name',
        email: 'an@email.com',
        password: 'password'
      })
      .then((user) => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it('should not allow sign in with incorrect password', (done) => {
      request.post({
        url: `${base}/users/sign_in`,
        form: {
          email: 'an@email.com',
          password: 'pazzwerd'
        }
      }, (err, res, body) => {
        expect(body).toContain('Redirecting to /users/sign_in');
        done();
      });
    });

    it('should not allow sign in with incorrect email', (done) => {
      request.post({
        url: `${base}/users/sign_in`,
        form: {
          email: 'an8888@email.com',
          password: 'password'
        }
      }, (err, res, body) => {
        expect(body).toContain('Redirecting to /users/sign_in');
        done();
      });
    });

  });

});
