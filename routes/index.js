const router = require('express').Router();
const authorisation = require('./authorisation');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const signout = require('./signout');
const NotFound = require('../errors/notFound');
const { failedPath, crashTest } = require('../utils/constants');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crashTest);
  }, 0);
});

router.use(authorisation);

router.use(auth);

router.use(userRouter);

router.use(movieRouter);

router.use(signout);

router.use('*', (req, res, next) => {
  next(new NotFound(failedPath));
});

module.exports = router;
