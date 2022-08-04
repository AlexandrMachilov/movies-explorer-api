require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;

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

require('./routes/auth')(app);

app.use(auth);

require('./routes/index')(app);

app.use((req, res, next) => {
  next(new ErrorNotFound("Sorry can't find that!"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
