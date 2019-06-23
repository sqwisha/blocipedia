const User = require('../../src/db/models').User;
const Wiki = require('../../src/db/models').Wiki;
const Collaborator = require('../../src/db/models').Collaborator;
const sequelize = require('../../src/db/models/index').sequelize;

describe('Wiki', () => {

  beforeEach((done) => {
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        name: 'New User',
        email: 'user@example.com',
        password: '1234567890'
      })
      .then((user) => {
        this.user = user;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe('#create()', () => {
    it('should create a wiki with a title, body, and assigned user', (done) => {
      Wiki.create({
        title: 'A Super Interesting Wiki',
        body: 'Things you never knew you wanted to know.',
        userId: this.user.id,
        private: false
      })
      .then((wiki) => {
        expect(wiki.title).toBe('A Super Interesting Wiki');
        expect(wiki.body).toBe('Things you never knew you wanted to know.');
        expect(wiki.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it('should not create a wiki with missing title, body, or UserId', (done) => {
      Wiki.create({
        title: 'A somewhat interesting wiki'
      })
      .then((wiki) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain('Wiki.body cannot be null');
        expect(err.message).toContain('Wiki.userId cannot be null');
        done();
      });
    });
  });

  describe('#setUser()', () => {

    it('should associate a wiki and a user together', (done) => {
      Wiki.create({
        title: 'Just a normal wiki',
        body: 'Things you might want to know.',
        userId: this.user.id,
        private: false
      })
      .then((wiki) => {
        expect(wiki.userId).toBe(this.user.id);

        User.create({
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          password: 'password'
        })
        .then((newUser) => {
          wiki.setUser(newUser)
          .then((wiki) => {
            expect(wiki.userId).toBe(newUser.id);
            done();
          });
        });
      });
    });
  });

  describe('#getUser()', () => {
    it('should return the associated user', (done) => {
      Wiki.create({
        title: 'An extraordinary wiki',
        body: 'This is gonna blow your mind.',
        userId: this.user.id,
        private: false
      })
      .then((wiki) => {
        wiki.getUser()
        .then((associatedUser) => {
          expect(associatedUser.email).toBe(this.user.email);
          done();
        });
      });
    });
  });

});
