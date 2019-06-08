const express = require('express');
const router = express.Router();
const validation = require('./validation');
const auth = require('../auth/helpers');

const userController = require('../controllers/userController');

router.get('/users/sign_up', userController.signUp);
router.post('/users/create', userController.create);
router.get('/users/sign_in', userController.signInForm);
router.post('/users/sign_in', validation.validateUsers, userController.signIn);
router.get('/users/sign_out', userController.signOut);
router.get('/users/account', auth.ensureAuthenticated, userController.show);
router.post('/users/:id/upgrade', userController.upgrade);

module.exports = router;
