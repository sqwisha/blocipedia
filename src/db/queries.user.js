const User = require('./models').User;
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
  }
};
