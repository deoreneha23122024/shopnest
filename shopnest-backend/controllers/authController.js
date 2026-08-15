const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const logger = require('../utils/logger');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin globally
try {
  if (!getApps().length) {
    initializeApp({ projectId: 'shopnest-97cbe' });
    logger.info('🔥 Firebase Admin initialized successfully');
  }
} catch (e) {
  logger.error('Firebase Admin global init error: ' + e.message);
}

/** Generate a signed JWT token */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/** Send email helper */
const sendEmail = async ({ to, subject, html }) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `ShopNest <${process.env.EMAIL_USER}>`,
    to, subject, html,
  });
};

/** POST /api/auth/register */
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'buyer' } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });
    if (!['buyer', 'seller'].includes(role))
      return res.status(400).json({ message: 'Role must be buyer or seller' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name: name || email.split('@')[0],
      email, password, role, provider: 'local'
    });
    const token = signToken(user._id);
    logger.info(`✅ New ${role} registered: ${email}`);
    res.status(201).json({ message: 'Account created successfully', token, user: user.toJSON() });
  } catch (err) {
    logger.error(`❌ Register error: ${err.message}`);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/** POST /api/auth/login */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user._id);
    logger.info(`🔐 User logged in: ${email} [${user.role}]`);
    res.status(200).json({ message: 'Login successful', token, user: user.toJSON() });
  } catch (err) {
    logger.error(`❌ Login error: ${err.message}`);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/** POST /api/auth/firebase-login — verify Firebase ID token, return ShopNest JWT */
const firebaseLogin = async (req, res) => {
  try {
    const { idToken, role = 'buyer' } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Firebase ID token required' });

    // Ensure Firebase Admin is initialized
    if (!getApps().length) {
      return res.status(503).json({ message: 'Firebase Admin init failed' });
    }

    const decoded = await getAuth().verifyIdToken(idToken);
    const { uid, email, name, picture, phone_number } = decoded;

    // Find or create user
    let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });
    if (!user) {
      user = await User.create({
        name: name || email?.split('@')[0] || `User_${uid.slice(0, 6)}`,
        email: email || `${uid}@phone.shopnest`,
        phone: phone_number || '',
        photoURL: picture || '',
        firebaseUid: uid,
        provider: phone_number ? 'phone' : 'google',
        role,
        password: null,
      });
      logger.info(`✅ New OAuth user: ${email || uid}`);
    } else if (!user.firebaseUid) {
      user.firebaseUid = uid;
      user.provider = phone_number ? 'phone' : 'google';
      if (picture && !user.photoURL) user.photoURL = picture;
      await user.save();
    }

    const token = signToken(user._id);
    res.status(200).json({ message: 'Login successful', token, user: user.toJSON() });
  } catch (err) {
    logger.error(`❌ Firebase login error: ${err.message}`);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

/** POST /api/auth/dev-phone-login — BYPASS OTP FOR DEV ONLY */
const devPhoneLogin = async (req, res) => {
  try {
    const { phone, role = 'buyer' } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number required' });

    // Find or create user based on phone
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name: `User_${phone.slice(-4)}`,
        email: `${phone}@phone.shopnest`,
        phone: phone,
        provider: 'phone',
        role,
        password: null,
      });
      logger.info(`✅ New Dev OAuth user created for phone: ${phone}`);
    }

    const token = signToken(user._id);
    res.status(200).json({ message: 'Dev login successful', token, user: user.toJSON() });
  } catch (err) {
    logger.error(`❌ Dev phone login error: ${err.message}`);
    res.status(500).json({ message: 'Dev phone login failed' });
  }
};

/** POST /api/auth/forgot-password */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_ORIGIN}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: '🔐 ShopNest Password Reset',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:12px">
            <h1 style="color:#f97316;margin-bottom:8px">🛍️ ShopNest</h1>
            <h2 style="color:#fff;margin-bottom:16px">Reset Your Password</h2>
            <p style="color:#94a3b8;margin-bottom:24px">You requested a password reset. Click the button below within <strong style="color:#fff">30 minutes</strong>.</p>
            <a href="${resetURL}" style="display:inline-block;background:#f97316;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin-bottom:24px">Reset Password</a>
            <p style="color:#64748b;font-size:13px">If you didn't request this, ignore this email. Your password won't change.</p>
            <p style="color:#64748b;font-size:12px;margin-top:24px;border-top:1px solid #1e293b;padding-top:16px">© 2026 ShopNest. All rights reserved.</p>
          </div>
        `,
      });
      logger.info(`📧 Password reset email sent to: ${email}`);
      res.status(200).json({ message: 'Password reset email sent. Check your inbox!' });
    } catch (emailErr) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });
      logger.error(`❌ Email send failed: ${emailErr.message}`);
      res.status(500).json({ message: 'Email could not be sent. Please check EMAIL_USER and EMAIL_PASS in .env' });
    }
  } catch (err) {
    logger.error(`❌ Forgot password error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

/** POST /api/auth/reset-password/:token */
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired' });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const token = signToken(user._id);
    logger.info(`🔑 Password reset successful: ${user.email}`);
    res.status(200).json({ message: 'Password reset successful! You are now logged in.', token, user: user.toJSON() });
  } catch (err) {
    logger.error(`❌ Reset password error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

/** GET /api/auth/me */
const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

/** POST /api/auth/setup-store */
const setupStore = async (req, res) => {
  try {
    const { storeName, storeDescription, storeCategory, phone } = req.body;
    if (!storeName || !phone)
      return res.status(400).json({ message: 'Store name and phone are required' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { storeName, storeDescription, storeCategory, phone, storeSetup: true, isApproved: true },
      { new: true, runValidators: true }
    ).select('-password');

    logger.info(`🏪 Seller store setup: ${storeName} (${req.user.email})`);
    res.status(200).json({ message: 'Store setup complete! Welcome to ShopNest 🎉', user });
  } catch (err) {
    logger.error(`❌ Store setup error: ${err.message}`);
    res.status(500).json({ message: 'Server error during store setup' });
  }
};

/** PUT /api/auth/profile */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, storeName, storeDescription, storeCategory } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (storeName) updates.storeName = storeName;
    if (storeDescription) updates.storeDescription = storeDescription;
    if (storeCategory) updates.storeCategory = storeCategory;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    logger.error(`❌ Profile update error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, firebaseLogin, devPhoneLogin, forgotPassword, resetPassword, getMe, setupStore, updateProfile };
