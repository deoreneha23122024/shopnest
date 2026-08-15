const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         email: { type: string }
 *         role: { type: string, enum: [buyer, seller] }
 *         storeName: { type: string }
 *         storeDescription: { type: string }
 *         phone: { type: string }
 *         isApproved: { type: boolean }
 */
const userSchema = new mongoose.Schema(
  {
    name:                  { type: String, trim: true, default: '' },
    email:                 { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:              { type: String, minlength: 6, default: null }, // null for OAuth users
    role:                  { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    phone:                 { type: String, default: '' },
    photoURL:              { type: String, default: '' },
    // Firebase OAuth
    firebaseUid:           { type: String, default: null },
    provider:              { type: String, enum: ['local', 'google', 'phone'], default: 'local' },
    // Seller fields
    storeName:             { type: String, default: '' },
    storeDescription:      { type: String, default: '' },
    storeCategory:         { type: String, default: '' },
    isApproved:            { type: Boolean, default: false },
    storeSetup:            { type: Boolean, default: false },
    // Password reset
    resetPasswordToken:    { type: String, default: null },
    resetPasswordExpires:  { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before saving (skip for OAuth users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password (safe for OAuth users)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
