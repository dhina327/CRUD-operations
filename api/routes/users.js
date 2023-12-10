const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user');

router.post('/signup',userControllers.user_signup );

router.post('/login', userControllers.user_login);

router.delete('/:userId', userControllers.user_delete);

module.exports = router;
