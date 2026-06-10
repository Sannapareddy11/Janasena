const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerFcmToken,
  unregisterFcmToken,
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/fcm-token', registerFcmToken);
router.delete('/fcm-token', unregisterFcmToken);

module.exports = router;
