const Wiki = require('../db/models').Wiki;
const wikiQueries = require('../db/queries.wiki');
const Authorizer = require('../policies/application');
const markdown = require('markdown-it')({
  html: true,
  linkify: true
});
const removeMd = require('remove-markdown', {useImgAltText: false});

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        req.flash('notice', 'There was a problem');
        res.redirect('/');
      } else {
        wikis.forEach((wiki) => {
          wiki.body = removeMd(wiki.body);
        });
        res.render('wikis/wiki', {wikis});
      }
    });
  },
  new(req, res, next) {
    const authorized = new Authorizer(req.user, null).new();

    if (authorized) {
      res.render('wikis/new');
    } else {
      req.flash('notice', 'You are not authorized to do that');
      res.redirect('/wikis/wiki');
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user, null).create();

    if (authorized) {
      wikiQueries.createWiki(req, (err, wiki) => {
        if (err) {
          req.flash('error', 'publishing failed, please try again');
          res.redirect('wikis/new');
        } else {
          res.redirect(`/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash('notice', 'You are not authorized to do that.');
      res.redirect('/wikis/wiki');
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || !wiki) {
        req.flash('notice', 'Wiki not found');
        res.redirect('/wikis/');
      } else {
        const authorized = new Authorizer(req.user, wiki).show();

        if (authorized) {
          wiki.body = markdown.render(wiki.body);
          res.render(`wikis/show`, {wiki});
        } else {
          req.flash('notice', 'You are not authorized to do that.');
          res.redirect('/wikis/');
        }
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || !wiki) {
        req.flash('error', err);
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();
        if (authorized) {
          res.render(`wikis/edit`, {wiki});
        }
      }
    });
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki === null) {
        req.flash('error', err);
        res.redirect(`/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  delete(req, res, next) {
    wikiQueries.deleteWiki(req, req.params.id, (err) => {
      if (err) {
        req.flash('error', err);
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        res.redirect('/wikis/');
      }
    });
  }

};
