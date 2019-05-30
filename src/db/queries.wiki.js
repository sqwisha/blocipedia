const Wiki = require('./models').Wiki;
const Authorizer = require('../policies/application');

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll()
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },
  getWiki(id, callback) {
    return Wiki.findOne({where: {id: id}})
    .then((wiki) => {
      callback(null, wiki);
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
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },
  updateWiki(req, updatedWiki, callback) {
    return Wiki.findOne({where: {id: req.params.id}})
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
  }
};
