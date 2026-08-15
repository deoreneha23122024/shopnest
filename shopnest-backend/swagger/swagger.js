const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopNest API',
      version: '1.0.0',
      description: `
## ShopNest E-Commerce Backend API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** for the ShopNest e-commerce platform.

### Features
- 📦 **Products** – Browse all products, filter by category, get single product
- 🛒 **Cart** – Add, remove, and view cart items (persisted to MongoDB)
- ❤️ **Wishlist** – Add, remove, and view wishlist/favorites (persisted to MongoDB)
- 📝 **Logging** – Winston + Morgan for descriptive HTTP and application logs
- 📖 **API Docs** – This Swagger UI

### Base URL
\`http://localhost:8080\`
      `,
      contact: {
        name: 'ShopNest Team',
        email: 'support@shopnest.dev',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Products', description: 'Product-related endpoints' },
      { name: 'Cart', description: 'Shopping cart endpoints' },
      { name: 'Wishlist', description: 'Wishlist / Favorites endpoints' },
    ],
  },
  // Scan these files for @swagger JSDoc comments
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * Register Swagger UI middleware on the Express app.
 * Accessible at GET /api-docs
 */
const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'ShopNest API Docs',
      customCss: `
        .swagger-ui .topbar { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
        .swagger-ui .topbar-wrapper .link span { color: #fff; font-weight: 700; }
      `,
    })
  );

  // Also expose the raw JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
