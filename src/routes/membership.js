const express = require('express');
const router = express.Router();

const membershipController = require('../controllers/membershipController');
const auth = require('../auth/helpers');

router.get('/membership/upgrade', auth.ensureAuthenticated,membershipController.upgrade);
router.get('/membership/upgrade/success', auth.ensureAuthenticated,membershipController.success);
router.get('/membership/upgrade/cancel', auth.ensureAuthenticated,membershipController.cancel);
router.post('/membership/downgrade', auth.ensureAuthenticated,membershipController.downgrade);


module.exports = router;
