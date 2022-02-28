const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');
const { authMessage, type, testJwt } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) throw new Unauthorized(authMessage);
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === type ? JWT_SECRET : testJwt);
  } catch (e) {
    next(new Unauthorized(authMessage));
  }
  req.user = payload;
  next();
};
