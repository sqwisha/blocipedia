require('dotenv').config();
const path = require('path');
const viewsFolder = path.join(__dirname, '..', 'views');
const logger = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('express-flash');
const passportConfig = require('./passport-config');
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../spec/', 'access.log'), {flags: 'a'});

module.exports = {
  init(app, express) {
    app.set('views', viewsFolder);
    app.set('view engine', 'ejs');
    app.use(logger('dev', { stream: accessLogStream }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '..', 'assets')));
    app.use(expressValidator());
    app.use(session({
      secret: process.env.cookieSecret || require('crypto').randomBytes(64).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 }
    }));
    app.use(flash());
    passportConfig.init(app);

    app.use((req,res,next) => {
      res.locals.currentUser = req.user;
      next();
    });
  }
};
