const User = require('../../src/db/models').User;
const sequelize = require('../../src/db/models/index').sequelize;

describe('User', () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe('#create', () => {
    it('should create a User with a valid email and password', (done) => {
      User.create({
        name: 'New User',
        email: 'user@example.com',
        password: '1234567890'
      })
      .then((user) => {
        expect(user.email).toBe('user@example.com');
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it('should not create a user with invalid email or password', (done) => {
      User.create({
        name: 'Bob Lowe',
        email: 'It\'s-a me, Mario!',
        password: '1234567890'
      })
      .then((user) => {
        // skip, will be invalid
        done();
      })
      .catch((err) => {
        expect(err.message).toContain('Validation error: must be valid email');
        done();
      });
    });

    it('should not create a user with an email already taken', (done) => {
      User.create({
        name: 'Another User',
        email: 'user@example.com',
        password: '1234567890'
      })
      .then((user) => {
        User.create({
          name: 'User Name',
          email: 'user@example.com',
          password: 'nananananananananananananananana BATMAN!'
        })
        .then((user) => {
          // skip, will be invalid
          done();
        })
        .catch((err) => {
          expect(err.message).toContain('Validation error');
          done();
        });

        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});
