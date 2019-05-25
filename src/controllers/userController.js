const userQueries = require('../db/queries.user');
const passport = require('passport');
const email = require('../sendgrid/email');
const flash = require('express-flash');

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
    passport.authenticate('local')(req, res, function() {
      if (!req.user) {
        req.flash('notice', 'Sign in failed. Please try again.');
        res.redirect('/users/sign_in');
      } else {
        req.flash('notice', `You've successfully signed in!`);
        res.redirect('/');
      }
    })
  },
  signOut(req, res, next) {
    req.logout();
    req.flash('notice', `You've successfully signed out!`);
    res.redirect('/');
  }
};
