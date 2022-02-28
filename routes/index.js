const router = require('express').Router();
const authorisation = require('./authorisation');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

router.use(authorisation);

router.use(auth);

router.use(userRouter);

router.use(movieRouter);

module.exports = router;
