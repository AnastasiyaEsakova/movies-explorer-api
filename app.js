require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { NODE_ENV, DB_URL } = process.env;

const { checkCors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes/index');

const ServerError = require('./errors/serverError');
const NotFound = require('./errors/notFound');
const {
  failedPath,
  exit,
  crashTest,
  dataBaseUrl,
  type,
} = require('./utils/constants');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(NODE_ENV === type ? DB_URL : dataBaseUrl, (err) => {
  if (err) console.log(err);
});

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(checkCors);

// для краш-теста
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crashTest);
  }, 0);
});

app.use(routes);

app.get('/signout', (req, res) => {
  res.clearCookie('jwt', {
    // maxAge: 3600000,
    // httpOnly: true,
    // secure: true,
    // sameSite: 'none',
  }).send({ message: exit });
});

app.use('*', (req, res, next) => {
  next(new NotFound(failedPath));
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (statusCode === 500) next(new ServerError());
  else res.status(statusCode).send({ message });
  next();
});

module.exports = app;
