# ShopNest Backend 🛍️

A production-grade **Node.js + Express + MongoDB** backend for the **ShopNest** E-Commerce Capstone Project.

---

## 📁 Project Structure

```
shopnest-backend/
├── index.js              ← Server entry point (starts server + DB connection)
├── app.js                ← Express app (routes & middleware only, no server)
├── config/
│   └── db.js             ← MongoDB connection via Mongoose
├── models/
│   ├── Product.js        ← Product schema
│   ├── Cart.js           ← Cart schema
│   └── Wishlist.js       ← Wishlist/Favorites schema
├── controllers/
│   ├── productController.js
│   ├── cartController.js
│   └── wishlistController.js
├── routes/
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── wishlistRoutes.js
├── middleware/
│   └── logger.js         ← Morgan HTTP logger (→ Winston)
├── utils/
│   └── logger.js         ← Winston logger (console + file)
├── seed/
│   └── seedProducts.js   ← Seeds 20 products into MongoDB
├── swagger/
│   └── swagger.js        ← Swagger UI at /api-docs
├── logs/
│   ├── combined.log
│   └── error.log
└── .env                  ← Environment variables
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd shopnest-backend
npm install
```

### 2. Configure environment
Edit `.env`:
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/shopnest   # or your Atlas URI
FRONTEND_ORIGIN=http://localhost:5173
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/products` | Get all products |
| GET | `/products/categories` | Get all categories |
| GET | `/products/:category` | Get products by category |
| GET | `/products/id/:id` | Get single product |
| GET | `/cart` | Get all cart items |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:productId` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |
| GET | `/favorites` | Get all wishlist items |
| POST | `/api/favorites` | Add item to wishlist |
| DELETE | `/api/favorites/:productId` | Remove from wishlist |

---

## 📖 API Documentation

With the server running, visit: **http://localhost:8080/api-docs**

---

## 📝 Logging

- All HTTP requests logged via **Morgan → Winston**
- `logs/combined.log` – All log levels
- `logs/error.log` – Error-only logs
- Console output with colors in development

---

## 🌐 Deployment

### Render (Backend)
1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set Build Command: `npm install`
4. Set Start Command: `node index.js`
5. Add environment variables: `MONGO_URI`, `PORT=10000`, `FRONTEND_ORIGIN`

### Netlify (Frontend)
1. Build ShopNest: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Set `VITE_API_BASE` to your Render backend URL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Logger | Winston + Morgan |
| API Docs | Swagger UI (OpenAPI 3.0) |
| CORS | cors middleware |
