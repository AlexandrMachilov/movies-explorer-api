require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const {
  signupValidation,
  signinValidation,
} = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { NODE_ENV, DB_URL } = process.env;
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

async function main() {
  await mongoose.connect(
    NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb',
    {
      useNewUrlParser: true,
    },
  );
  app.listen(PORT);
}

main();

app.use(cors);

app.use(requestLogger);

app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);

app.use(auth);

require('./routes/index')(app);

app.use((req, res, next) => {
  next(new ErrorNotFound("Sorry can't find that!"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
