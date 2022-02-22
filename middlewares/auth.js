const jwt = require('jsonwebtoken');
const NewError = require('../errors/error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) throw new NewError('Необходима авторизация.', 401);
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    next(new NewError('Необходима авторизация.', 401));
  }
  req.user = payload;
  next();
};
