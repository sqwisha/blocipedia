const User = require('../../src/db/models').User;
const Wiki = require('../../src/db/models').Wiki;
const Collaborator = require('../../src/db/models').Collaborator;
const sequelize = require('../../src/db/models/index').sequelize;

describe('Collaborator', () => {
  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      this.user;
      this.wiki;

      User.create({
        name: 'Just Me',
        email: 'just@me.com',
        password: 'password',
        role: 0,
        wikis: [{
          title: 'My first wiki',
          body: 'This is neat.',
          private: false
        },
        {
          title: 'My second wiki',
          body: 'This is still fun.',
          private: false
        }]
      },
      {
        include: {
          model: Wiki,
          as: 'wikis'
        }
      })
      .then((user) => {
        this.user = user;
        this.wiki = user.wikis[0];
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe('#create()', () => {
    it('should create a new collaboration', (done) => {
      User.create({
        name: 'Another User',
        email: 'user@user.com',
        password: 'password',
        role: 0
      })
      .then((user) => {
        Collaborator.create({
          wikiId: this.wiki.id,
          userId: user.id
        })
        .then((collaborator) => {
          expect(collaborator.wikiId).toBe(this.wiki.id);
          expect(collaborator.userId).toBe(user.id);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it('should not create a collaboration without an associated wikiId', (done) => {
      Collaborator.create({
        userId: this.user.id,
        wikiId: 99
      })
      .then(() => {
        // will skip
      })
      .catch((err) => {
        expect(err.name).toBe('SequelizeForeignKeyConstraintError');
        done();
      });
    });

    it('should not create a collaboration without an associated userId', (done) => {
      Collaborator.create({
        userId: 99,
        wikiId: this.wiki.id
      })
      .then(() => {
        // will skip
      })
      .catch((err) => {
        expect(err.name).toBe('SequelizeForeignKeyConstraintError');
        done();
      });
    });
  });

  describe('#setUser()', () => {
    it('should associate a user and a collaborator together', (done) => {
      Collaborator.create({
        wikiId: this.user.wikis[1].id,
        userId: this.user.id
      })
      .then((collaborator) => {
        this.collaborator = collaborator;
        expect(collaborator.userId).toBe(this.user.id);

        User.create({
          name: 'Bob',
          email: 'bob@example.com',
          password: 'password'
        })
        .then((newUser) => {
          this.collaborator.setUser(newUser)
          .then((collaborator) => {
            expect(collaborator.userId).toBe(newUser.id);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });

  describe('#getUser()', () => {
    it('should return associated user', (done) => {
      Collaborator.create({
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((collaborator) => {
        collaborator.getUser()
        .then((user) => {
          expect(user.id).toBe(this.user.id);
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe('#setWiki()', () => {
    it('should associate wiki and collaborator together', (done) => {
      Collaborator.create({
        wikiId: this.wiki.id,
        userId: this.user.id
      })
      .then((collaborator) => {
        this.collaborator = collaborator;

        Wiki.create({
          title: 'A New Wiki',
          body: 'Lots of interesting facts.',
          private: false,
          userId: this.user.id
        })
        .then((newWiki) => {

          expect(this.collaborator.wikiId).toBe(this.wiki.id);

          this.collaborator.setWiki(newWiki)
          .then((collaborator) => {

            expect(collaborator.wikiId).toBe(newWiki.id);
            done();

          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    })
  });

  describe('#getWiki()', () => {
    it('should return the associated wiki', (done) => {
      Collaborator.create({
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((collaborator) => {
        collaborator.getWiki()
        .then((associatedWiki) => {
          expect(associatedWiki.title).toBe('My first wiki');
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});
