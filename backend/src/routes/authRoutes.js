const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.get('/nonce/:address', authController.getNonce);
router.post('/verify', authController.verifySignature);
router.get('/subscription/:address', verifyToken, authController.checkSubscription);

module.exports = router; 