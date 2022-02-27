const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');
const { authMessage } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) throw new Unauthorized(authMessage);
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    next(new Unauthorized(authMessage));
  }
  req.user = payload;
  next();
};
