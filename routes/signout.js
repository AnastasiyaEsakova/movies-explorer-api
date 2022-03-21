const router = require('express').Router();
const { exit } = require('../utils/constants');

router.get('/signout', (req, res) => {
  res.clearCookie('jwt', {
    maxAge: 3600000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  }).send({ message: exit });
});

module.exports = router;
