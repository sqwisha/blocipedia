const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/wikis';
const sequelize = require('../../src/db/models/index').sequelize;

const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('routes : wikis', () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then(() => {
      User.create({
        name: 'Matrim Cauthon',
        email: 'bloodandashes@thewheel.com',
        password: 'theDarkOnesOwnLuck'
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: 'Band of the Red Hand',
          body: 'The original Band of the Red Hand dates back to Manetheren, and was a unit of legendary heroes during the Trolloc Wars. They were the last to fall, guarding King Aemon when Manetheren died. The huge battles during the Trolloc Wars, accompanied by armies of 300,000 men or more, required a detailed command structure to keep everyone and everything from falling apart.',
          private: false,
          userId: user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });


  });

  describe('GET /wikis', () => {
    it('should display all wikis', (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Wikis');
        done();
      });
    });
  });

  describe('member user performing CRUD operations on Wikis', () => {
    beforeEach((done) => {
      request.get({
        url: 'http://localhost:3000/auth/fake',
        form: {
          role: this.user.role,
          userId: this.user.id,
          email: this.user.email
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe('GET /wikis/new', () => {
      it('should display new wiki form', (done) => {
        request.get(`${base}/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('New Wiki');
          done();
        })
      });
    });

    describe('POST wikis/create', () => {
      it('should create a new wiki and display', (done) => {
        request.post({
          url: `${base}/create`,
          form: {
            title: 'Fortuona Athaem Devi Paendrag',
            body: 'Fortuona Athaem Devi Paendrag is the current Empress of the Seanchan (officially recognized on this side of the Arith Ocean, while the Seanchan homeland is still in chaos). She was formerly known as Tuon Athaem Kore Paendrag, the Daughter of the Nine Moons, heir to the throne, the second and favorite daughter of the late Empress of the Seanchan empire.'
          }
        }, (err, res, body) => {
          Wiki.findOne({where: {title: 'Fortuona Athaem Devi Paendrag'}})
          .then((wiki) => {
            expect(wiki).not.toBeNull();
            expect(wiki.body).toContain('is the current Empress of the Seanchan');
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe('GET wikis/:id', () => {
      it('should display given wiki', (done) => {
        request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('Band of the Red Hand');
          done();
        });
      });
    });

    describe('GET wikis/:id/edit', () => {
      it('should display edit form for given wiki', (done) => {
        request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('Edit Wiki');
          done();
        });
      });
    });

    describe('POST wikis/:id/update', () => {
      it('should update given wiki with new content', (done) => {
        const options = {
          url: `${base}/${this.wiki.id}/update`,
          form: {
            title: 'Band of the Red Hand',
            body:`"We'll toss the dice however they fall,
            and snuggle the girls be they short or tall,
            then follow young Mat whenever he calls,
            to dance with Jak o' the Shadows."
              —song of the Band

            The original Band of the Red Hand dates back to Manetheren, and was a unit of legendary heroes during the Trolloc Wars. They were the last to fall, guarding King Aemon when Manetheren died. The huge battles during the Trolloc Wars, accompanied by armies of 300,000 men or more, required a detailed command structure to keep everyone and everything from falling apart.`
          }
        }

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {id: this.wiki.id}})
          .then((wiki) => {
            expect(wiki.body).toContain('song of the Band');
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe('POST wikis/:id/delete', () => {
      it('should delete given wiki', (done) => {
        Wiki.findOne({where: {id: this.wiki.id}})
        .then((wiki) => {
          expect(wiki).not.toBeNull();

          request.post(`${base}/${this.wiki.id}/delete`, (err, res, body) => {
            Wiki.findOne({where: {id: this.wiki.id}})
            .then((wiki) => {
              expect(wiki).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });

});
