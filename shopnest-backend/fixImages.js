require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const logger = require('./utils/logger');

const categoryImages = {
  'electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=500&q=80'
  ],
  'jewelery': [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&w=500&q=80'
  ],
  "men's clothing": [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=500&q=80'
  ],
  "women's clothing": [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=500&q=80'
  ]
};

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB');

    const products = await Product.find({});
    for (let product of products) {
      if (product.image.includes('fakestoreapi.com')) {
        const catImages = categoryImages[product.category] || categoryImages['electronics'];
        const randomImage = catImages[Math.floor(Math.random() * catImages.length)];
        product.image = randomImage;
        await product.save();
        logger.info(`Updated image for product ${product.id}`);
      }
    }
    
    logger.info('Finished updating images');
    process.exit(0);
  } catch (error) {
    logger.error('Failed', error);
    process.exit(1);
  }
}

fixImages();
