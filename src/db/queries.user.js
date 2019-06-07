const User = require('./models').User;
const Wiki = require('./models').Wiki;
const bcrypt = require('bcryptjs');

module.exports = {
  createUser(newUser, callback) {
    if (newUser.password !== newUser.password_conf) {
      return callback({
        param: 'Error: ',
        msg: 'password and confirmation do not match'
      });
    }
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback({
        param: '',
        msg: err.errors[0].message
      });
    })
  },
  upgradeUser(user, callback) {
    User.findOne({where: {id: user.id}})
    .then((user) => {
      user.update({
        role: 1
      })
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },
  downgradeUser(user, callback) {
    return User.findOne({
      where: {id: user.id},
      include: [{
        model: Wiki,
        as: 'wikis'
      }]
    })
    .then((user) => {
      user.update({
        role: 0
      })
      .then((res) => {
        if (user.wikis) {
          user.wikis.forEach((wiki) => {
            wiki.update({
              private: false
            });
          });
          callback(null, user.wikis);
        } else {
          callback(null, null);
        }
      })
      .catch((err) => {
        callback(err);
      });
    });
  },
  getUserWikis(user, callback) {
    return Wiki.findAll({
      where: {userId: user.id}
    })
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  }
};
