require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { NODE_ENV, DB_URL } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');
const NewError = require('./errors/error');
const { checkCors } = require('./middlewares/cors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { failedPath, serverError, exit } = require('./utils/constants');
const { limiter } = require('./middlewares/limiter');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb', (err) => {
  if (err) throw new Error('error');
});

app.use(helmet());
app.use(limiter);
app.use(checkCors);
app.use(requestLogger);

// для краш-теста
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).trim(true),
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required().min(2),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required().min(2),
  }),
}), login);

app.use(auth);

app.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt', {
    // maxAge: 3600000,
    // httpOnly: true,
    // secure: true,
    // sameSite: 'none',
  }).send({ message: exit });
});

app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use('*', (req, res, next) => {
  next(new NewError(failedPath, 404));
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverError
        : message,
    });
  next();
});

module.exports = app;
