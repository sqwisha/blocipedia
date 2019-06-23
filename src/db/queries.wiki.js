const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;
const removeMd = require('remove-markdown', {useImgAltText: false});
const Authorizer = require('../policies/application');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  showWikis(req, user, callback) {
    if (!user) { user = {id: -1} }
    if (user.role == 2) {
      Wiki.findAll()
      .then((wikis) => {
        callback(null, wikis);
      })
      .catch((err) => {
        callback(err);
      });
    } else {
      Collaborator.findAll({
        attributes:[
          'wikiId'
        ],
        where: {
          userId: user.id
        }
      })
      .then((collaborators) => {
        Wiki.findAll({
          where: {
            [Op.or]: [
              {private: false},
              {userId: user.id},
              {id: collaborators.map(col => col.wikiId)}
            ]
          },
          include: [{
            model: Collaborator,
            as: 'collaborators'
          }],
          order: [['title', 'ASC']]
        })
        .then((wikis) => {
          wikis.forEach((wiki) => {
            let auth = new Authorizer(req.user, wiki);
            wiki.body = removeMd(wiki.body);
            wiki.userIsOwner = auth._isOwner();
            wiki.userIsCollaborator = auth._isCollaborator();
          });
          callback(null, wikis);
        })
        .catch((err) => {
          callback(err);
        });
      })
      .catch((err) => {
        callback(err);
      });
    }
  },
  getPureWiki(wikiId, callback) {
    return Wiki.findOne({
      where: {
        id: wikiId
      }
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  },
  getWiki(req, callback) {
    return Wiki.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Collaborator,
        as: 'collaborators',
        include: [{
          model: User
        }]
      }]
    })
    .then((wiki) => {
      User.findAll({
        where: {
          id: {
            [Op.not] : [...wiki.collaborators.map(col =>  col.userId), req.user ? req.user.id : 0]
          }
        },
        order: [['name', 'ASC']]
      })
      .then((users) => {
        let auth = new Authorizer(req.user, wiki);
        wiki.userIsCollaborator = auth._isCollaborator();
        wiki.userIsOwner = auth._isOwner();
        callback(null, wiki, users);
      })
      .catch((err) => {
        callback(err);
      });
    })
    .catch((err) => {
      callback(err);
    });
  },
  createWiki(req, callback) {
    return Wiki.create({
      title: req.body.title,
      body: req.body.body,
      private: req.body.private === 'true',
      userId: req.user.id
    })
    .then((wiki) => {
      if (req.body.collaborators) {
        let collaborators = req.body.collaborators.map((user) => {
          return {
            userId: parseInt(user),
            wikiId: wiki.id
          }
        });

        Collaborator.bulkCreate(collaborators)
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        callback(null, wiki);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },
  updateWiki(req, updatedWiki, callback) {
    return Wiki.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Collaborator,
        as: 'collaborators'
      }]
    })
    .then((wiki) => {
      if (!wiki) { return callback('Wiki not found') }

      const authorized = new Authorizer(req.user, wiki).update();

      if (authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash('notice', 'You are not authorized to do that.');
        callback('Forbidden');
      }
    });
  },
  deleteWiki(req, id, callback) {
    Wiki.findOne({where: {id: id}})
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).delete();

      if (authorized) {
        wiki.destroy()
        .then((res) => {
          callback(null);
        });
      } else {
        req.flash('notice', 'You are not authorized to do that.');
        callback('Forbidden');
      }
    })
    .catch((err) => {
      callback(err);
    });
  },
  addCollaborator(wikiId, userId, callback) {
    Collaborator.findOrCreate({
      where: {
        wikiId: wikiId,
        userId: userId
      },
      defaults: {
        wikiId: wikiId,
        userId: userId
      }
    })
    .then(() => {
      callback(null);
    })
    .catch((err) => {
      callback(err);
    });
  },
  deleteCollaborator(req, callback) {
    Wiki.findOne({
      where: {
        id: req.params.id
      }
    })
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).delete();

      if (authorized) {
        Collaborator.destroy({
          where: {
            id: req.params.collaboratorId
          }
        })
        .then(() => {
          callback(null);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        callback(401);
      }
    })
    .catch((err) => {
      callback('Wiki not found');
    });
  }
};
