const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/membership';
const sequelize = require('../../src/db/models/index').sequelize;

const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('routes : membership', () => {

  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      this.user;
      this.wiki;

      User.create({ // default standard membership
        name: 'A girl has no name',
        email: 'faceless@braavos.com',
        password: 'thenorthremembers',
        role: 0,
        wikis: [{
          title: 'Only one Wiki',
          body: 'This is my first and only wiki.',
          private: false
        }]
      }, {
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

  // GET /membership/upgrade
  // GET /membership/upgrade/success
  // GET /membership/upgrade/cancel
  // POST /membership/downgrade

  describe('GET membership/upgrade', () => {
    beforeEach((done) => {
      request.get({
        url: 'http://localhost:3000/auth/fake',
        form: {
          email: this.user.email,
          role: this.user.role,
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    it('should display a page with Premium membership info', (done) => {
      request.get(`${base}/upgrade`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Upgrade for just $15');
        done();
      });
    });
  });

  describe('GET membership/upgrade/success', () => {
    beforeEach((done) => {
      request.get({
        url: 'http://localhost:3000/auth/fake',
        form: {
          email: this.user.email,
          role: this.user.role,
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    it('should upgrade member to premium', (done) => {
      expect(this.user.role).toBe(0);

      request.get(`${base}/upgrade/success`, (err, res, body) => {
        expect(body).toContain('Congratulations');

        User.findOne({where : {id: this.user.id}})
        .then((user) => {
          expect(user.role).toBe(1);
          done();
        });
      });
    });
  });

  describe('GET membership/upgrade/cancel', () => {
    beforeEach((done) => {
      request.get({
        url: 'http://localhost:3000/auth/fake',
        form: {
          email: this.user.email,
          role: this.user.role,
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    it('should redirect to upgrade canceled page', (done) => {
      request.get(`${base}/upgrade/cancel`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain('Upgrade Canceled');
        done();
      });
    });
  });

  describe('POST membership/downgrade', () => {
    it('should downgrade a premium member to standard', (done) => {
      User.create({
        name: 'My Name',
        email: 'justme@email.com',
        password: 'apassword',
        role: 1,
      })
      .then((user) => {
        request.get({
          url: 'http://localhost:3000/auth/fake',
          form: {
            email: user.email,
            role: user.role,
            userId: user.id
          }
        },
        (err, res, body) => {
          request.post(`${base}/downgrade`, (err, res, body) => {
            User.findOne({where: {id: user.id}})
            .then((user) => {
              expect(user.role).toBe(0);
              done();
            });
          });
        });
      });
    });

  });


})
