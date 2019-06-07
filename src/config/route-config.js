module.exports = {
  init(app) {
    const staticRoutes = require('../routes/static');
    const userRoutes = require('../routes/users');
    const wikiRoutes = require('../routes/wikis');
    const membershipRoutes = require('../routes/membership');

    if (process.env.NODE_ENV === 'test') {
      const mockAuth = require('../../spec/support/mock-auth');
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes);
    app.use(membershipRoutes);
  }
};
