# Pharmacy Management System

## Stack
- **Backend:** Node.js + TypeScript + Express 5 + **Mongoose (MongoDB)** — no Prisma, no ORM magic, just Mongoose schemas and plain queries you can read top to bottom.
- **Frontend:** React + TypeScript + Vite + React Query + Recharts

## Structure
```
pharmacy-system/
├── Backend/
│   └── src/
│       ├── config/       # cors, cloudinary, razorpay config (optional integrations)
│       ├── constants/    # shared constant values
│       ├── controllers/  # thin request handlers, call services
│       ├── DB/           # Mongoose connection + seed script
│       ├── interfaces/   # shared TS interfaces
│       ├── middleware/   # auth, validation, upload, rate limiting, error handling
│       ├── models/       # Mongoose schemas (User, Medicine, Customer, Sale)
│       ├── routes/       # Express route definitions
│       ├── services/     # business logic, MongoDB queries
│       ├── types/        # ambient/global type declarations
│       ├── utils/        # apiError, apiResponse, asyncHandler, email, cloudinary upload
│       ├── validators/   # zod request-body schemas
│       ├── app.ts        # Express app assembly (helmet, cors, morgan, rate limiting)
│       ├── env.ts        # environment variable validation
│       └── index.ts      # connects to MongoDB, then starts the server
└── FrontEnd/
    └── src/
        ├── components/
        │   ├── auth/       # LoginForm
        │   ├── common/     # Navbar, ProtectedRoute
        │   ├── dashboard/  # StockChart
        │   ├── customers/
        │   └── inventory/
        ├── context/        # AuthContext + useAuth hook
        ├── pages/          # Login, Dashboard, Inventory, Customers
        ├── services/       # axios instance + per-resource API calls
        ├── types/          # shared TS interfaces
        └── App.tsx / main.tsx
```

## Setup

### 1. MongoDB
Use either:
- **Local:** install MongoDB Community Server, it'll listen on `mongodb://127.0.0.1:27017`
- **MongoDB Atlas (recommended):** free tier at mongodb.com/atlas — gives you a connection string and doesn't require installing anything locally

### 2. Backend
```bash
cd Backend
npm install
cp .env.example .env       # fill in MONGO_URI and JWT_SECRET at minimum
npm run seed                # creates demo admin + sample data
npm run dev                 # http://localhost:5000
```
Demo login after seeding: `admin@pharmacy.com` / `Admin@123`

Everything except `MONGO_URI` and `JWT_SECRET` in `.env.example` is **optional** — Cloudinary (medicine photos), Resend (low-stock email alerts), and Razorpay (online payment orders) all silently no-op if you leave those blank. The core app (auth, inventory, customers, sales) works without any of them.

### 3. Frontend
```bash
cd FrontEnd
npm install
cp .env.example .env       # points VITE_API_URL at the backend
npm run dev                 # http://localhost:5173
```

## Why Mongoose instead of Prisma
Prisma generates a client from a schema file behind the scenes, which can feel like a black box if you haven't used it before. Mongoose is more direct — you define a schema, get a model, and call `.find()`, `.create()`, `.findByIdAndUpdate()` etc. directly against MongoDB. Every query in this project is plain and readable in the `services/` folder — nothing is generated or hidden.

## Notes
- IDs are MongoDB ObjectIds (24-character hex strings), not UUIDs — the `objectIdSchema` validator in `validators/common.validator.ts` checks for that format.
- `sale.service.ts` does **not** use a MongoDB transaction, because transactions require a replica set (Atlas has this by default; a plain local `mongod` does not). For a single-pharmacist project, sequential writes are safe enough in practice — there's a comment in that file if you want to upgrade to a transaction later.
- Role-based access (`ADMIN` vs `PHARMACIST`) is enforced via the `authorize()` middleware — e.g., only `ADMIN` can delete a medicine or trigger the low-stock email.
- `asyncHandler` forwards any rejected promise straight to the central `errorHandler`, so you never need a `try/catch` inside a controller.
# Pharmacy-Management-System
