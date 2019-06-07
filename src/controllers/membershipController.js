const userQueries = require('../db/queries.user');
const email = require('../sendgrid/email');

module.exports = {
  upgrade(req, res, next) {
    if (req.user.role === 1) {
      req.flash('notice', 'Sweet, you are already a Premium Member!');
      res.redirect('users/account');
    } else {
      res.render('membership/upgrade');
    }
  },
  success(req, res, next) {
    userQueries.upgradeUser(req.user, (err, user) => {
      if (err || !user) {
        req.flash('error', err);
        res.redirect('index');
      } else {
        email.upgrade(user);
        res.render('membership/success');
      }
    });
  },
  cancel(req, res, next) {
    res.render('membership/cancel');
  },
  downgrade(req, res, next) {
    userQueries.downgradeUser(req.user, (err, wikis) => {
      if (err) {
        req.flash('notice', 'There was a problem');
        res.redirect('/users/account');
      } else {
        req.flash('notice', 'Successfully downgraded to Standard Membership');
        res.render('users/account', {wikis});
      }
    })
  },

};
