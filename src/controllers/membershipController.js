const userQueries = require('../db/queries.user');

module.exports = {
  upgrade(req, res, next) {
    if (req.user.role === 1) {
      req.flash('notice', 'Sweet, you are already a Premium Member!');
      res.redirect('/users/account');
    } else {
      res.render('membership/upgrade');
    }
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
