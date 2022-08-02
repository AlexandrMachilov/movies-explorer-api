const usersRoutes = require('./users');
const moviesRoutes = require('./movies');

module.exports = (app) => {
  app.use('/users', usersRoutes);
  app.use('/movies', moviesRoutes);
};
