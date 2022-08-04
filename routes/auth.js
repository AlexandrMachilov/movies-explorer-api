const {
  signupValidation,
  signinValidation,
} = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

module.exports = (app) => {
  app.post('/signin', signinValidation, login);
  app.post('/signup', signupValidation, createUser);
};
