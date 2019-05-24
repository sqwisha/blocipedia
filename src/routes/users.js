const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/users/sign_up', userController.signUp);
router.post('/users/create', userController.create);

module.exports = router;
