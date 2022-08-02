require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const ErrorNotFound = require('./errors/ErrorNotFound');
/* const { auth } = require('./middlewares/auth'); */
const errorHandler = require('./middlewares/errorHandler');
const {
  signupValidation,
  signinValidation,
} = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
/* const cors = require('./middlewares/cors'); */

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

async function main() {
  await mongoose.connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
  });
  app.listen(PORT);
}

main();

/* app.use(cors); */

app.use(requestLogger);

app.post('/signin', signupValidation, login);
app.post('/signup', signinValidation, createUser);

require('./routes/index')(app);

app.use(
  /* auth,  */ (req, res, next) => {
    next(new ErrorNotFound("Sorry can't find that!"));
  },
);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
