const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required: [title, price, category]
 *       properties:
 *         id:          { type: integer }
 *         title:       { type: string }
 *         description: { type: string }
 *         price:       { type: number }
 *         category:    { type: string }
 *         image:       { type: string }
 *         model3dUrl:  { type: string }
 *         videoUrl:    { type: string }
 *         stock:       { type: integer }
 *         sellerId:    { type: string }
 *         sellerName:  { type: string }
 *         storeName:   { type: string }
 *         rating:
 *           type: object
 *           properties:
 *             rate:  { type: number }
 *             count: { type: integer }
 */
const productSchema = new mongoose.Schema(
  {
    // Numeric ID for frontend compatibility (FakeStore API format)
    id:          { type: Number, unique: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, required: true, lowercase: true, trim: true },
    image:       { type: String, default: 'https://via.placeholder.com/300x300?text=No+Image' },
    model3dUrl:  { type: String, default: '' },
    videoUrl:    { type: String, default: '' },
    stock:       { type: Number, default: 100, min: 0 },
    sellerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    sellerName:  { type: String, default: 'ShopNest' },
    storeName:   { type: String, default: 'ShopNest Store' },
    rating: {
      rate:  { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Auto-increment numeric ID before saving
productSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    const last = await mongoose.model('Product').findOne().sort({ id: -1 }).select('id');
    this.id = last ? last.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
