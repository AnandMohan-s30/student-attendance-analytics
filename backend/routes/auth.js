const router  = require('express').Router();
const auth    = require('../middleware/auth');
const { login, logout, me } = require('../controllers/auth');

router.post('/login',  login);
router.post('/logout', logout);
router.get ('/me',     auth, me);

module.exports = router;
