const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequest = require('../errors/badRequest');
const Unauthorized = require('../errors/unauthorized');
const Conflict = require('../errors/conflict');
const {
  badRequestUserMessage,
  authFailData,
  badRequestNewUserMessage,
  authBadEmail,
  testJwt,
  type,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      const {
        name, email, _id,
      } = user;
      res.send({
        data: {
          name, email, _id,
        },
      });
    })
    .catch(next);
};

module.exports.setUserInfo = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then(() => {
      res.send({
        data: {
          name, email,
        },
      });
    })
    .catch((e) => {
      if (e.name === 'ValidationError' || e.name === 'CastError') next(new BadRequest(badRequestUserMessage));
      else if (e.code === 11000) next(new Conflict(authBadEmail));
      else next(e);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const result = User.create({
        name, email, password: hash,
      });
      return result;
    })
    .then(() => {
      res.send({
        data: {
          name, email,
        },
      });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') next(new BadRequest(badRequestNewUserMessage));
      else if (e.code === 11000) next(new Conflict(authBadEmail));
      else next(e);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === type ? JWT_SECRET : testJwt,
        { expiresIn: 3600000 },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
        .send({ token });
    })
    .catch(() => {
      next(new Unauthorized(authFailData));
    });
};
