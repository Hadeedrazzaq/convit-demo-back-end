# Corvit-Demo · Backend

Node/Express + MongoDB API for the Corvit-Demo COD e-commerce app.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth, bcrypt password hashing
- COD-only order flow

## Quick start
```bash
cp .env.example .env              # set MONGO_URI, JWT_SECRET, ADMIN_*
npm install
npm run seed                      # wipes DB + seeds 1 admin, 5 customers, 26 products, 18 demo orders
npm run dev                       # http://localhost:5000
```

Default credentials:
- Admin: `admin@eapp.dev` / `admin123`
- Customer: `ava@example.com` / `password123` (and 4 more)

## API surface

| Method | Route | Access |
|---|---|---|
| GET | `/api/health` | public |
| POST | `/api/users/signup` | public |
| POST | `/api/users/login` | public |
| GET | `/api/users/profile` | user |
| GET | `/api/products?page=&limit=&category=` | public |
| GET | `/api/products/:id` | public |
| POST / PUT / DELETE | `/api/products[/:id]` | admin |
| POST | `/api/orders` | user (admins rejected) |
| GET | `/api/orders/mine` | user |
| GET | `/api/orders/:id` | user (owner) or admin |
| GET | `/api/orders?page=&limit=` | admin |
| PUT | `/api/orders/:id/deliver` | admin |

## Postman
Import `postman/Corvit-Demo.postman_collection.json` and `postman/Corvit-Demo.postman_environment.json`. Logins auto-capture the JWT into `{{authToken}}`.

## Deploy (free tier)
- **MongoDB Atlas** M0 → `MONGO_URI`
- **Render** web service → root `/`, build `npm install`, start `node server.js`. Set env vars + `CORS_ORIGIN` to the frontend URL.
