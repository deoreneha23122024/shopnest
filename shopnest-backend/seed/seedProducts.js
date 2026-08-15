/**
 * seedProducts.js – Database Seeder
 *
 * Seeds 20 sample products into MongoDB for ShopNest.
 * Categories match FakeStore API: electronics, men's clothing, women's clothing, jewelery
 *
 * Run with: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const logger = require('../utils/logger');

const products = [
  // ── Electronics ───────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    description: 'Your perfect pack for everyday use and a long term companion for all your adventures including the great outdoors.',
    price: 109.95,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81fAn9gTFsL._AC_SX679_.jpg',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric.',
    price: 22.3,
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    description: 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions.',
    price: 55.99,
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: 'Mens Casual Slim Fit',
    description: 'The color could be slightly different between on the screen and in practice.',
    price: 15.99,
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    rating: { rate: 2.1, count: 430 },
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
    price: 695,
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 6,
    title: 'Solid Gold Petite Micropave',
    description: 'Satisfaction Guaranteed. Return or exchange any order within 30 days.',
    price: 168,
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_FMwebp_QL65_.jpg',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 7,
    title: 'White Gold Plated Princess',
    description: 'Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her.',
    price: 9.99,
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg',
    rating: { rate: 3, count: 400 },
  },
  {
    id: 8,
    title: 'Pierced Owl Rose Gold Plated Stainless Steel Double',
    description: 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel',
    price: 10.99,
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg',
    rating: { rate: 1.9, count: 100 },
  },
  {
    id: 9,
    title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
    description: 'USB 3.0 and USB 2.0 Compatibility. Fast data transfers. Improve PC Performance.',
    price: 64,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 10,
    title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
    description: 'Easy upgrade for faster boot up, shutdown, game load and application launch.',
    price: 109,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: { rate: 2.9, count: 470 },
  },
  {
    id: 11,
    title: 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5',
    description: '3D NAND flash are applied to deliver high read/write speeds Remarkable transfer speeds.',
    price: 109,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg',
    rating: { rate: 4.8, count: 319 },
  },
  {
    id: 12,
    title: 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive',
    description: 'Expand your PS4 gaming experience, Play anywhere.',
    price: 114,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    rating: { rate: 4.8, count: 400 },
  },
  {
    id: 13,
    title: 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin',
    description: '21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology.',
    price: 599,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
    rating: { rate: 2.9, count: 250 },
  },
  {
    id: 14,
    title: 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA)',
    description: '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side.',
    price: 999.99,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    rating: { rate: 2.2, count: 140 },
  },
  {
    id: 15,
    title: 'BIYLACLESEN Women\'s 3-in-1 Snowboard Jacket Winter Coats',
    description: 'Detachable: 2 in 1 Windproof Snowboard Jacket 100% Polyester. Long enough to cover your ski boots.',
    price: 56.99,
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    rating: { rate: 2.6, count: 235 },
  },
  {
    id: 16,
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    description: '100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER).',
    price: 29.95,
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
    rating: { rate: 2.9, count: 340 },
  },
  {
    id: 17,
    title: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
    description: 'Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist.',
    price: 39.99,
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg',
    rating: { rate: 3.8, count: 679 },
  },
  {
    id: 18,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    description: '95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort.',
    price: 9.85,
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',
    rating: { rate: 4.7, count: 130 },
  },
  {
    id: 19,
    title: "Opna Women's Short Sleeve Moisture Tunic",
    description: '100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit.',
    price: 7.95,
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg',
    rating: { rate: 4.5, count: 146 },
  },
  {
    id: 20,
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    description: '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print, V-Neck, Fashion Tees.',
    price: 12.99,
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg',
    rating: { rate: 3.6, count: 145 },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('✅ Connected to MongoDB for seeding');

    // Clear existing products
    await Product.deleteMany({});
    logger.info('🗑️ Cleared existing products');

    // Insert seed data (bypass auto-increment since we set id manually)
    await Product.insertMany(products);
    logger.info(`🌱 Successfully seeded ${products.length} products`);

    await mongoose.disconnect();
    logger.info('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
