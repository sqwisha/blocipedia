const userQueries = require('../db/queries.user');
const passport = require('passport');
const email = require('../sendgrid/email');
const flash = require('express-flash');
const stripe = require('stripe')('pk_test_yKxWzowzQDtQUVvTldTwHva200dtooZ4CL');

module.exports = {
  signUp(req, res, next) {
    res.render('users/sign_up');
  },
  create(req, res, next) {
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password_conf: req.body.password_conf
    }

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/users/sign_up');
      } else {
        passport.authenticate('local')(req, res, () => {
          req.flash('notice', 'You have successfully signed in!');
          res.redirect('/');
          email.welcome(user);
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render('users/sign_in');
  },
  signIn(req, res, next) {
    passport.authenticate('local')(req, res, function () {
      if (req.user === undefined || !req.user.passwordMatch) {
        req.logout();
        req.flash('notice', 'Sign in failed. Please try again.')
        res.redirect('/users/sign_in');
      } else {
        req.flash('notice', `You've successfully signed in!`);
        res.redirect('/');
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash('notice', `You've successfully signed out!`);
    res.redirect('/');
  },
  show(req, res, next) {
    userQueries.getUserWikis(req.user, (err, wikis) => {
      if (err || !wikis) {
        req.flash('notice', 'Something went wrong.');
        res.redirect('/');
      } else {
        res.render('users/account', {wikis});
      }
    });
  },
  upgrade(req, res, next) {
    const stripeToken = req.body.stripeToken;

    stripe.charges.create({
      amount: 1500,
      currency: "usd",
      description: "Upgrade tp premium User",
      source: stripeToken
    })
    .then(() => {
      userQueries.upgradeUser(req.user, (err, user) => {
        if (err || !user) {
          req.flash('error', err);
          res.render('index');
        } else {
          email.upgrade(user);
          res.render('membership/success');
        }
      });
    })
    .catch((err) => {
      console.log(err);
      req.flash('error', 'You are not authorized to do that.');
      res.render('index');
    });
  }
};
