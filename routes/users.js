const router = require('express').Router();
const { getUser, setUserInfo } = require('../controllers/users');
const { validationUserInfo } = require('../middlewares/validation');

router.get('/users/me', getUser);

router.patch('/users/me', validationUserInfo, setUserInfo);

module.exports = router;
