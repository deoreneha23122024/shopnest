require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const logger = require('./utils/logger');

const MODEL_3D = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

async function seedRichMedia() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB');

    // Add 3D models and video to a few specific products or to all? 
    // Let's add them to the first 4 products for testing.
    const products = await Product.find({}).limit(4);
    
    for (let product of products) {
      product.model3dUrl = MODEL_3D;
      product.videoUrl = VIDEO_URL;
      await product.save();
      logger.info(`Added 3D/Video media to product ${product.id}`);
    }
    
    logger.info('Finished seeding rich media');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed rich media', error);
    process.exit(1);
  }
}

seedRichMedia();
