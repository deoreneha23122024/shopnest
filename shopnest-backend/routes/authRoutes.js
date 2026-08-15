const express = require('express');
const router = express.Router();
const {
  register, login, firebaseLogin, devPhoneLogin,
  forgotPassword, resetPassword,
  getMe, setupStore, updateProfile
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);
router.post('/dev-phone-login', devPhoneLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/setup-store', protect, restrictTo('seller'), setupStore);
router.put('/profile', protect, updateProfile);

module.exports = router;
