# Pharmacy Management System - Project Overview

## 1. Introduction

The **Pharmacy Management System** is a modern, full-stack web application designed to streamline and automate the operations of a pharmacy business. It provides a centralized platform for managing medicines inventory, customer information, sales transactions, payments, and user authentication. The system is built with a robust backend API and an intuitive frontend interface, enabling pharmacists and administrators to efficiently manage day-to-day pharmacy operations.

### Key Objectives:
- Centralize medicine inventory management with real-time stock tracking
- Track sales transactions and maintain customer records
- Automate low-stock alerts and reorder management
- Process online payments through Razorpay integration
- Provide role-based access control (Admin vs Pharmacist)
- Ensure data security with JWT-based authentication

---

## 2. Problem Statement

### Current Pharmacy Challenges:
1. **Manual Inventory Management** - Pharmacies often track stock levels manually, leading to errors and wastage
2. **Stock-out Issues** - No automated alerts when medicines run low, resulting in lost sales
3. **Customer Data Disorganization** - Customer information scattered across multiple systems
4. **Sales Tracking** - Difficulty in tracking which medicines are selling and generating reports
5. **Payment Processing** - Limited online payment options, mostly cash-based transactions
6. **Access Control** - No distinction between admin and staff permissions in existing systems
7. **Medicine Expiry Management** - Difficulty in tracking and managing expired medicines
8. **Poor Analytics** - Lack of insights into sales trends and inventory metrics

### Solution:
This system provides an integrated platform where all pharmacy operations are digitalized, automated, and tracked in real-time. It enables data-driven decision-making and reduces manual overhead.

---

## 3. Architecture Overview

### 3.1 Tech Stack

```
Frontend:
├── React 18.3 (UI Library)
├── TypeScript (Type Safety)
├── Vite (Build Tool)
├── React Router DOM (Routing)
├── React Query/TanStack Query (State Management & Caching)
├── Axios (API Calls)
└── Recharts (Data Visualization)

Backend:
├── Node.js (Runtime)
├── TypeScript (Type Safety)
├── Express 5.2 (Web Framework)
├── Mongoose 9.8 (MongoDB ODM)
├── MongoDB (Database)
├── JWT (Authentication)
├── Bcrypt (Password Hashing)
└── Multer (File Upload)

Database:
├── MongoDB (Local or MongoDB Atlas)
└── Mongoose ODM for schema validation

OPTIONAL External Services (gracefully disabled if not configured):
├── Cloudinary (Image Storage) — configure via CLOUDINARY_* env vars
├── Razorpay (Payment Gateway) — configure via RAZORPAY_* env vars
└── Resend (Email Alerts) — configure via RESEND_API_KEY env var
```

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │ Login Page   │ Dashboard    │ Inventory    │ ... etc      │
│  └──────────────┴──────────────┴──────────────┘             │
│         │              │              │                      │
│         └──────────────┬──────────────┘                      │
│                        │ (Axios HTTP Calls)                  │
└════════════════════════╪════════════════════════════════════┘
                         │
        ┌────────────────┼────────────────┐
        │                                  │
┌───────▼────────────────────────────────┐ │
│    Express API (Node.js Backend)       │ │
│                                        │ │
│  ┌─────────────────────────────────┐  │ │
│  │ Routes Layer                    │  │ │
│  │ ├── /api/auth                   │  │ │
│  │ ├── /api/medicines              │  │ │
│  │ ├── /api/customers              │  │ │
│  │ ├── /api/sales                  │  │ │
│  │ └── /api/payments               │  │ │
│  └──────────┬──────────────────────┘  │ │
│             │                         │ │
│  ┌──────────▼──────────────────────┐  │ │
│  │ Middleware Layer                │  │ │
│  │ ├── Authentication Middleware   │  │ │
│  │ ├── Authorization (Role Check)  │  │ │
│  │ ├── Validation (Zod Schemas)    │  │ │
│  │ ├── Rate Limiting               │  │ │
│  │ ├── Error Handling              │  │ │
│  │ └── CORS & Security (Helmet)    │  │ │
│  └──────────┬──────────────────────┘  │ │
│             │                         │ │
│  ┌──────────▼──────────────────────┐  │ │
│  │ Controllers Layer               │  │ │
│  │ (Thin, delegates to Services)   │  │ │
│  └──────────┬──────────────────────┘  │ │
│             │                         │ │
│  ┌──────────▼──────────────────────┐  │ │
│  │ Services Layer                  │  │ │
│  │ (Business Logic & Queries)      │  │ │
│  └──────────┬──────────────────────┘  │ │
│             │                         │ │
└─────────────┼─────────────────────────┘ │
              │                           │
              │ (Mongoose Queries)        │
              │                           │
    ┌─────────▼─────────────┐             │
    │  MongoDB Database     │             │
    │ ┌─────────────────┐   │             │
    │ │ Users           │   │             │
    │ │ Medicines       │   │             │
    │ │ Customers       │   │             │
    │ │ Sales           │   │             │
    │ └─────────────────┘   │             │
    └───────────────────────┘             │
                                          │
                    ┌─────────────────────┘
                    │ (External APIs)
                    │
    ┌───────────────┼───────────────┬──────────────┐
    │               │               │              │
┌───▼──┐      ┌────▼─────┐  ┌──────▼──┐   ┌─────▼──┐
│Azure │      │Cloudinary│  │Razorpay │   │Resend  │
│Atlas │      │(Images)  │  │(Payment)│   │(Email) │
└──────┘      └──────────┘  └─────────┘   └────────┘
```

---

## 4. Complete Workflow Explanation

### 4.1 User Authentication Flow

#### Registration Process:
1. User submits registration form (name, email, password)
2. Frontend sends POST request to `/api/auth/register`
3. Backend validates input using Zod schema validation
4. Password is hashed using bcrypt (10 salt rounds)
5. User document is created in MongoDB
6. Default role is set to "PHARMACIST"
7. Response returns user object (password excluded)

#### Login Process:
1. User submits login credentials (email, password)
2. Frontend sends POST request to `/api/auth/login`
3. Backend retrieves user from database
4. Password is compared with stored hash using bcrypt
5. If valid, JWT token is generated with payload: `{ userId, email, role }`
6. Token is set as HTTP-only cookie (7-day expiration)
7. Frontend stores token in browser memory/context
8. User is redirected to dashboard

#### Logout Process:
1. User clicks logout button
2. Frontend clears HTTP-only cookie
3. Access token is removed from context
4. User is redirected to login page

#### Authentication Middleware:
```
Every Protected Route Request:
  1. Extract token from Authorization header (Bearer token)
  2. Verify token using JWT secret
  3. Decode token and attach user info to request object
  4. Pass control to next middleware/controller
  If token invalid/expired → 401 Unauthorized error
```

#### Authorization (Role-Based Access Control):
```
Certain endpoints require specific roles:
  - ADMIN only:
    * DELETE /api/medicines/:id (delete medicine)
    * GET /api/medicines/low-stock (view low stock items)
    * POST /api/medicines/send-alert (send low-stock emails)
    * DELETE /api/customers/:id
  - PHARMACIST + ADMIN:
    * All read operations
    * Create/Update medicines
    * Create sales
    * View customers
```

---

### 4.2 Medicine Inventory Management Workflow

#### Add New Medicine:
1. Admin/Pharmacist accesses "Add Medicine" form
2. Fills form: name, category, quantity, reorder level, price, expiry date, optional image
3. Image is uploaded to Cloudinary (returns secure URL)
4. POST request to `/api/medicines` with form data
5. Backend validates data (Zod schema)
6. Medicine document created in MongoDB
7. Stock history is logged
8. Success response with medicine details

#### View Medicines:
1. Frontend sends GET request to `/api/medicines`
2. Backend queries all medicines from database
3. Optionally filter by category or search by name
4. Medicines are indexed on `name` field for faster queries
5. Paginated results returned with total count
6. Frontend displays in table with images

#### Update Medicine Details:
1. Pharmacist clicks "Edit" on a medicine
2. Form pre-populated with current medicine data
3. Updates quantity, price, expiry date, or image
4. PATCH request to `/api/medicines/:id`
5. Backend performs validation
6. Document is updated in MongoDB
7. Response confirms changes
8. UI reflects updated values

#### Delete Medicine:
1. Only ADMIN can delete medicines
2. Sends DELETE request to `/api/medicines/:id`
3. Backend checks authorization
4. Medicine document is removed from database
5. All sales referencing this medicine become inconsistent (design choice)

#### Low-Stock Alert System:
1. Scheduled job or manual trigger by ADMIN
2. Queries medicines where `quantity < reorderLevel`
3. For each low-stock medicine:
   - Collects all relevant pharmacy email addresses
   - Sends email alert via Resend/Nodemailer
   - Email contains medicine name, current stock, reorder level
4. Log of alerts is maintained
5. Alert status can be viewed in admin dashboard

---

### 4.3 Customer Management Workflow

#### Register New Customer:
1. During sales entry, pharmacist can create new customer
2. Enters: name, email, phone number, address
3. POST request to `/api/customers`
4. Backend validates input
5. Customer document created in MongoDB
6. Response returns customer with auto-generated ID

#### View All Customers:
1. Frontend sends GET request to `/api/customers`
2. Backend returns list of all customers with their details
3. Frontend displays in table format
4. Customers can be sorted by name, registration date, etc.

#### Update Customer Info:
1. Pharmacist clicks "Edit" on customer record
2. Updates contact information, address, etc.
3. PATCH request to `/api/customers/:id`
4. Backend validates and updates
5. Related sales records still reference same customer

#### Delete Customer:
1. Only ADMIN can delete customer profiles
2. Deleting customer affects sales history (design choice)
3. Option to archive instead of delete (future enhancement)

---

### 4.4 Sales Transaction Workflow

#### Create Sale:
1. Pharmacist selects medicine and customer
2. Enters quantity to sell
3. System auto-calculates total: `total = quantity × medicine.price`
4. POST request to `/api/sales` with medicine ID, customer ID, quantity
5. Backend validates:
   - Medicine exists and has sufficient stock
   - Customer exists
   - Quantity is positive integer
6. Database transaction (in professional setup):
   - Create Sale document
   - Deduct quantity from Medicine stock
   - Update medicine's last modified timestamp
7. Sale record created with timestamp
8. Response returns sale details
9. Medicine inventory updated in UI
10. Optional: Payment processing (see payment section)

#### View Sales History:
1. Frontend sends GET request to `/api/sales`
2. Backend returns paginated list of sales
3. Each sale includes:
   - Medicine name (populated from reference)
   - Customer name (populated from reference)
   - Quantity sold
   - Total amount
   - Timestamp
4. Can filter by date range, medicine, or customer
5. Dashboard displays sales analytics and charts

#### Sales Analytics:
1. Backend aggregates sales data:
   - Total sales count
   - Total revenue
   - Most sold medicines
   - Customer purchase frequency
2. Recharts visualizes:
   - Line chart: Sales over time
   - Bar chart: Top 10 medicines by quantity
   - Pie chart: Sales by category
3. Data updated in real-time as sales occur

---

### 4.5 Payment Processing Workflow (OPTIONAL - Razorpay)

**Note:** Payment processing is optional and only available if Razorpay credentials are configured in `.env`. Without configuration, sales default to cash/offline payment.

#### Online Payment Order Creation (if Razorpay enabled):
1. Pharmacist completes sale entry
2. Clicks "Pay Online" button
3. Creates payment order via `/api/payments/create-order`
4. Backend creates Razorpay order (if configured):
   - Amount from sale total (in paise)
   - Currency: INR
   - Receipt ID generated
5. Returns order ID to frontend
6. Frontend can open Razorpay payment modal
7. Customer enters payment details on Razorpay
8. Payment is processed

**Note:** Payment verification webhook is not currently implemented. Production implementation would require webhook configuration.

#### Offline Payment (Default):
1. Sale is recorded immediately
2. Marked as completed without online payment
3. Can be settled via cash at counter
4. No payment verification needed

---

### 4.6 Request Lifecycle

#### Complete Request-Response Cycle:

```
User Action (Frontend)
        │
        ▼
HTTP Request (Axios)
        │
        ├─ URL: /api/endpoint
        ├─ Method: GET/POST/PATCH/DELETE
        ├─ Headers: Authorization, Content-Type
        └─ Body: JSON data (if applicable)
        │
        ▼
Express Server Receives
        │
        ├─ Helmet: Security headers added
        ├─ CORS: Origin validation
        ├─ Morgan: Request logged
        └─ Rate Limiter: Check against quota
        │
        ▼
Route Matching
        │
        ▼
Middleware Pipeline
        │
        ├─ Authenticate Middleware: Verify JWT token
        │  │
        │  ├─ Extract token from Authorization header
        │  ├─ Verify signature
        │  └─ Attach user to request (req.user)
        │
        ├─ Authorize Middleware: Check role
        │  │
        │  └─ Check if user.role in allowedRoles
        │
        └─ Validation Middleware: Validate inputs
           │
           ├─ Parse request body
           ├─ Run Zod schema validation
           └─ If invalid, return 400 error
        │
        ▼
Controller Function
        │
        ├─ Thin layer: delegates to service
        └─ Calls service.method(req.body, req.user)
        │
        ▼
Service Layer
        │
        ├─ Business logic
        ├─ Database queries (Mongoose)
        │  │
        │  ├─ Query: findById, find, create, etc.
        │  ├─ Execute against MongoDB
        │  └─ Return results or throw error
        │
        └─ Data transformation
        │
        ▼
Response Object Created
        │
        ├─ statusCode: 200/201/400/401/403/500
        ├─ data: Actual result
        ├─ message: Human-readable message
        └─ success: boolean
        │
        ▼
Error Handler (if error occurred)
        │
        ├─ Catch any thrown ApiError or Exception
        ├─ Log error details
        ├─ Format error response
        └─ Send error response to client
        │
        ▼
HTTP Response Sent
        │
        ├─ Status Code
        ├─ Headers
        └─ JSON Body
        │
        ▼
Frontend Receives Response
        │
        ├─ Axios interceptor checks status
        ├─ If error: Show error toast/alert
        └─ If success: Update component state/cache
        │
        ▼
UI Updated
        │
        └─ Display data, close loading spinner, etc.
```

---

### 4.7 Error Handling

#### Error Flow:
1. Error occurs in controller/service/middleware
2. Error object (ApiError) thrown with:
   - Status code (400, 401, 403, 404, 500)
   - Error message
   - Optional error details
3. Central error handler catches it (asyncHandler wrapper)
4. Error formatted as JSON response
5. Sent to frontend with appropriate status code
6. Frontend displays error message to user

#### Error Types:
- **400 Bad Request**: Validation failed, invalid input
- **401 Unauthorized**: No token or invalid token
- **403 Forbidden**: Sufficient auth but not authorized for action
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server-side exception
- **429 Too Many Requests**: Rate limit exceeded

---

## 5. Database Schema & Data Models

### 5.1 User Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // e.g., "John Doe"
  email: String,                   // unique, lowercase
  password: String,                // bcrypt hash
  role: String,                    // "ADMIN" or "PHARMACIST"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique index on `email` for fast lookup

---

### 5.2 Medicine Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // e.g., "Aspirin 500mg"
  category: String,                // e.g., "Pain Relief"
  quantity: Number,                // Current stock count
  reorderLevel: Number,            // Alert threshold (e.g., 10)
  price: Number,                   // Price per unit (INR)
  expiryDate: Date,                // Expiration date
  imageUrl: String,                // Cloudinary URL (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Index on `name` for faster searches

**Constraints:**
- quantity: min 0
- price: min 0
- reorderLevel: min 0

---

### 5.3 Customer Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // Customer name
  email: String,                   // Contact email
  phone: String,                   // Phone number
  address: String,                 // Delivery/home address
  createdAt: Date,
  updatedAt: Date
}
```

---

### 5.4 Sale Collection

```javascript
{
  _id: ObjectId,
  medicine: ObjectId,              // Reference to Medicine document
  customer: ObjectId,              // Reference to Customer document
  quantity: Number,                // Units sold
  total: Number,                   // Total price (quantity × medicine.price)
  soldAt: Date,                    // When sale occurred
  createdAt: Date,
  updatedAt: Date
}
```

**References:**
- `medicine` → Medicine._id (populated on retrieval)
- `customer` → Customer._id (populated on retrieval)

**Constraints:**
- quantity: min 1
- total: min 0

---

### 5.5 Relationships

```
User
  └─ (1 user can create/manage multiple medicines and sales)

Medicine
  └─ (0 to many sales reference each medicine)
     └─ Sale

Customer
  └─ (0 to many sales reference each customer)
     └─ Sale

Sale
  ├─ References: Medicine (via medicine ID)
  └─ References: Customer (via customer ID)
```

---

## 6. API Endpoints Reference

### 6.1 Authentication Endpoints

```
POST /api/auth/register
  Request: { name, email, password }
  Response: { _id, name, email, role }
  Auth: None
  Role: None

POST /api/auth/login
  Request: { email, password }
  Response: { user: {...}, token: "jwt..." }
  Auth: None
  Role: None
  Side Effect: Sets HttpOnly cookie with token

POST /api/auth/logout
  Request: {}
  Response: { message: "Logged out successfully" }
  Auth: JWT
  Role: Any
  Side Effect: Clears authentication cookie
```

---

### 6.2 Medicine Endpoints

```
GET /api/medicines
  Query: { category?, search?, page?, limit? }
  Response: { medicines: [...], total, page, limit }
  Auth: JWT
  Role: Any

GET /api/medicines/:id
  Response: { medicine: {...} }
  Auth: JWT
  Role: Any

POST /api/medicines
  Request: { name, category, quantity, reorderLevel, price, expiryDate, image? }
  Response: { medicine: {...} }
  Auth: JWT
  Role: ADMIN, PHARMACIST
  Side Effect: Uploads image to Cloudinary

PATCH /api/medicines/:id
  Request: { name?, category?, quantity?, price?, reorderLevel?, expiryDate?, image? }
  Response: { medicine: {...} }
  Auth: JWT
  Role: ADMIN, PHARMACIST

DELETE /api/medicines/:id
  Response: { message: "Medicine deleted" }
  Auth: JWT
  Role: ADMIN only

GET /api/medicines/low-stock/alert
  Response: { medicines: [...] }  // medicines where quantity < reorderLevel
  Auth: JWT
  Role: ADMIN only

POST /api/medicines/send-alert
  Request: { medicineIds?: [...] }  // specific medicines or all low-stock
  Response: { message: "Alerts sent", count: N }
  Auth: JWT
  Role: ADMIN only
  Side Effect: Sends emails via Resend/Nodemailer
```

---

### 6.3 Customer Endpoints

```
GET /api/customers
  Query: { page?, limit?, search? }
  Response: { customers: [...], total, page, limit }
  Auth: JWT
  Role: Any

GET /api/customers/:id
  Response: { customer: {...} }
  Auth: JWT
  Role: Any

POST /api/customers
  Request: { name, email, phone, address }
  Response: { customer: {...} }
  Auth: JWT
  Role: ADMIN, PHARMACIST

PATCH /api/customers/:id
  Request: { name?, email?, phone?, address? }
  Response: { customer: {...} }
  Auth: JWT
  Role: ADMIN, PHARMACIST

DELETE /api/customers/:id
  Response: { message: "Customer deleted" }
  Auth: JWT
  Role: ADMIN only
```

---

### 6.4 Sale Endpoints

```
GET /api/sales
  Query: { startDate?, endDate?, medicineId?, customerId?, page?, limit? }
  Response: { sales: [...], total, page, limit }
  Auth: JWT
  Role: Any

GET /api/sales/:id
  Response: { sale: {...} }
  Auth: JWT
  Role: Any

GET /api/sales/analytics/summary
  Response: {
    totalSales: N,
    totalRevenue: N,
    topMedicines: [...],
    salesByCategory: {...}
  }
  Auth: JWT
  Role: Any

POST /api/sales
  Request: { medicineId, customerId, quantity }
  Response: { sale: {...} }
  Auth: JWT
  Role: ADMIN, PHARMACIST
  Side Effect: Decrements medicine quantity, creates sale record
  Note: No MongoDB transaction; sequential writes assumed safe
```

---

### 6.5 Payment Endpoints (OPTIONAL)

**Note:** Payment endpoints only work if Razorpay credentials are configured in `.env`. Otherwise returns 400 error.

```
POST /api/payments/create-order
  Request: { amount: number }
  Response: { orderId, amount, currency, receipt }
  Auth: JWT
  Role: ADMIN, PHARMACIST
  Status: Returns error if RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set
  External: Razorpay API call (only if configured)
  Note: Frontend can use orderId to open Razorpay checkout modal
```

---

## 7. Frontend Application Flow

### 7.1 Frontend Architecture

```
src/
├── App.tsx                 # Main app entry with routing
├── main.tsx               # React DOM render
├── App.css / index.css    # Global styles
│
├── context/
│   └── AuthContext.tsx    # Global auth state (user, token, login/logout)
│
├── hooks/
│   └── useAuth.ts         # Custom hook to access AuthContext
│
├── services/
│   ├── api.ts             # Axios instance with interceptors
│   ├── auth.service.ts    # Auth API calls
│   ├── medicine.service.ts
│   ├── customer.service.ts
│   ├── sale.service.ts
│   └── payment.service.ts
│
├── types/
│   └── index.ts           # TypeScript interfaces (User, Medicine, etc.)
│
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── common/
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── customers/
│   ├── dashboard/
│   │   └── StockChart.tsx
│   └── inventory/
│
└── pages/
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── Inventory.tsx
    ├── Customers.tsx
    └── Sales.tsx
```

---

### 7.2 Authentication Context Flow

```
Initial App Load:
    │
    ├─ App.tsx mounts
    │  │
    │  ├─ AuthContext.Provider wraps all routes
    │  │
    │  └─ useEffect: Check if token in localStorage/cookie
    │     │
    │     ├─ If token exists:
    │     │  └─ Decode and set current user in context
    │     │
    │     └─ If no token:
    │        └─ Keep logged out state
    │
    ├─ ProtectedRoute component checks auth:
    │  │
    │  ├─ If authenticated:
    │  │  └─ Render dashboard/protected pages
    │  │
    │  └─ If not authenticated:
    │     └─ Redirect to login page
    │
    └─ All pages can access user info via useAuth hook:
       const { user, token, login, logout } = useAuth();
```

---

### 7.3 Page Workflows

#### Login Page (`/login`):
1. User sees login form
2. Enters email and password
3. Form submitted to `/api/auth/login`
4. On success:
   - Token stored (localStorage/cookie)
   - User object stored in AuthContext
   - Redirected to `/dashboard`
5. On failure:
   - Error message displayed
   - Form remains visible for retry

#### Dashboard (`/dashboard`):
1. Query all sales data from `/api/sales`
2. Calculate analytics:
   - Total sales count
   - Total revenue
   - Top 10 medicines
3. Fetch low-stock medicines
4. Display charts using Recharts:
   - Sales trend over time
   - Top medicines bar chart
   - Category distribution pie chart
5. Show quick stats cards
6. Refresh button for manual update

#### Inventory Page (`/inventory`):
1. GET `/api/medicines` (with pagination)
2. Display medicines in table:
   - Name (with image)
   - Category
   - Current qty / Reorder level
   - Price
   - Expiry date
   - Actions: Edit, Delete, View
3. Filter by category dropdown
4. Search medicines by name
5. Add New Medicine button:
   - Opens modal with form
   - File upload for medicine image
   - On submit: POST `/api/medicines`
6. Edit Medicine:
   - Click Edit → Opens form with current values
   - Modify fields
   - PATCH `/api/medicines/:id`
7. Low Stock Alert (ADMIN only):
   - Button to view low-stock items
   - Button to send email alerts
8. Pagination controls

#### Customers Page (`/customers`):
1. GET `/api/customers`
2. Display customers in table:
   - Name
   - Email
   - Phone
   - Address
   - Actions: Edit, Delete
3. Add New Customer button:
   - Opens form
   - POST `/api/customers`
4. Edit Customer:
   - PATCH `/api/customers/:id`
5. Search by name or email

#### Sales Page (`/sales`):
1. GET `/api/sales` with optional filters
2. Display sales history in table:
   - Medicine name
   - Customer name
   - Quantity
   - Total price
   - Date & time
3. Add New Sale button:
   - Dropdown to select medicine (shows current stock)
   - Dropdown to select customer (or create new inline)
   - Input quantity
   - Auto-calculate total: `qty × price`
   - Actions: Proceed to payment or Save offline
4. On "Proceed to Payment":
   - Call `/api/payments/create-order`
   - Razorpay modal opens
   - Complete payment
   - Verify via `/api/payments/verify`
   - Sale marked as paid
5. Filter by date range, medicine, customer

---

### 7.4 API Interceptor Pattern

```typescript
// services/api.ts

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  // Add Authorization header with token
  const token = getTokenFromContext();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      // Clear auth context
      // Redirect to login
      logout();
    }
    throw error;
  }
);
```

---

### 7.5 State Management with React Query

```typescript
// Example: Fetch medicines list

const { data: medicines, isLoading, error } = useQuery({
  queryKey: ['medicines', { category, page }],  // Cache key
  queryFn: () => medicineService.getAll({ category, page }),  // Fetch function
  staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
  retry: 2,  // Retry failed requests twice
});

// Example: Mutate (POST/PATCH/DELETE)

const { mutate: addMedicine, isPending } = useMutation({
  mutationFn: (data) => medicineService.create(data),
  onSuccess: () => {
    // Invalidate cache to refetch
    queryClient.invalidateQueries({ queryKey: ['medicines'] });
    showSuccessToast('Medicine added!');
  },
  onError: (error) => {
    showErrorToast(error.message);
  },
});
```

---

## 8. Key Features in Depth

### 8.1 Role-Based Access Control (RBAC)

#### Admin Privileges:
- Delete medicines from inventory
- Delete customer profiles
- View and send low-stock email alerts
- Delete sales records
- View all users and manage roles (future)
- Generate reports (future)
- Configuration management (future)

#### Pharmacist Privileges:
- Add/edit medicines (quantity, price, expiry)
- Add/edit customers
- Create sales
- View all data (read-only)
- Process online payments
- Cannot delete records or access admin functions

#### Enforcement:
- Frontend: Hide admin buttons from pharmacists
- Backend: Middleware checks `req.user.role` against `allowedRoles`
- If unauthorized: 403 Forbidden error

---

### 8.2 Input Validation with Zod

```typescript
// validators/auth.validator.ts

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be 8+ chars"),
});

// Middleware applies validation
validate(loginSchema),  // → req.body is guaranteed valid after this
```

**Validation Types:**
- Email format
- ObjectId format (MongoDB IDs)
- Positive numbers for quantities/prices
- Date format for expiry dates
- Enum values for categories/roles

---

### 8.3 Security Measures

1. **Helmet.js**: Adds security headers (CSP, X-Frame-Options, etc.)
2. **CORS Configuration**: Whitelist allowed origins
3. **JWT Authentication**: Token-based stateless auth
4. **Password Hashing**: Bcrypt (10 rounds) prevents rainbow table attacks
5. **HTTP-only Cookies**: Token not accessible to JavaScript
6. **Rate Limiting**: Max 100 requests per 15 minutes per IP
7. **Error Message Sanitization**: Don't leak internal details to users
8. **Input Validation**: Zod schemas prevent injection attacks

---

### 8.4 Image Upload with Cloudinary (OPTIONAL)

**Note:** Image uploads are optional and only work if Cloudinary credentials are configured. Without configuration, image upload endpoint silently fails and imageUrl remains empty.

```
User uploads medicine image (if Cloudinary configured)
        │
        ▼
Multer middleware processes upload
        │
        ├─ Validate file type (jpg, png, webp)
        ├─ Validate file size (checked by Multer)
        └─ Convert to buffer
        │
        ▼
Streamifier converts buffer to stream
        │
        ▼
Upload to Cloudinary (if CLOUDINARY_* env vars set)
        │
        ├─ Creates cloudinary folder: "pharmacy-medicines"
        ├─ Assigns unique public_id
        └─ Returns secure_url (HTTPS)
        │
        ▼
Save URL in Medicine document
        │
        └─ imageUrl field in database (optional)
        │
        ▼
Frontend displays image if available (graceful fallback to no image)
```

**If Cloudinary not configured:** Images are accepted but not uploaded; imageUrl field remains empty.

---

### 8.5 Email Notifications (OPTIONAL - Resend)

**Note:** Email alerts are optional and only enabled if Resend API key is configured. Without configuration, email sending is skipped with a log message.

#### Low-Stock Alert Email:

```
Trigger: ADMIN clicks "Send Low-Stock Alert" (if endpoint exists)
        │
        ▼
Service queries low-stock medicines
        │
        ▼
Build email body:
        │
        ├─ List of medicines below reorder level
        ├─ Medicine name
        ├─ Current stock quantity
        └─ Reorder level threshold
        │
        ▼
Send via Resend (if RESEND_API_KEY configured)
        │
        ├─ From: ALERT_EMAIL_FROM env var
        └─ To: ALERT_EMAIL_TO env var
        │
        ▼
If not configured:
        └─ Log message: "[email] Skipped — Resend is not configured"
```

---

### 8.6 Razorpay Payment Integration (OPTIONAL)

**Note:** Razorpay integration is completely optional. Core system works with offline/cash payments. Payment order creation only works if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.

#### Payment Order Creation Flow (if configured):

```
Frontend can initiate payment:
        │
        ├─ User clicks "Pay Online" (if button exists)
        ├─ POST /api/payments/create-order with amount
        └─ Receives Razorpay order ID
        │
        ▼
Backend creates Razorpay order (if credentials present):
        │
        ├─ Amount from sale total (converted to paise)
        ├─ Currency: INR
        ├─ Receipt ID generated
        └─ Returns orderId to frontend
        │
        ▼
Frontend opens Razorpay checkout widget
        │
        ├─ User enters payment details on Razorpay modal
        └─ Razorpay processes transaction
        │
        ▼
Without Razorpay configured:
        │
        ├─ POST /api/payments/create-order returns 400 error
        └─ System defaults to offline/cash payment
```

**Payment verification and webhook are NOT currently implemented.** To add this in production, webhook endpoint and signature verification would need to be added.

---

### 8.7 Data Seeding

`npm run seed` creates initial data:
1. Admin user: `admin@pharmacy.com` / `Admin@123`
2. Sample medicines (10-15) across categories
3. Sample customers (5-10)
4. Sample sales transactions (10-20) with random details

Purpose: Quick local development and testing without manual data entry

---

## 9. Technology Rationale

### Why These Technologies?

| Technology | Why | Alternative | Why Not |
|-----------|-----|-------------|---------|
| **Express.js** | Lightweight, flexible, large ecosystem | Django, FastAPI | Slower, Python-specific |
| **Mongoose** | Direct MongoDB integration, readable queries | Prisma, TypeORM | Black-box generation, steeper learning |
| **React** | Component-based, large community, performance | Vue, Svelte | Smaller ecosystems |
| **TypeScript** | Type safety, catches errors early | JavaScript | Runtime errors, less IDE support |
| **JWT** | Stateless, scalable, standard for APIs | Sessions | Server memory overhead, not scalable |
| **Bcrypt** | Industry standard, slow (prevents brute force) | SHA-256 | Fast hashing = weak against attacks |
| **Razorpay** | Indian payment gateway, easy integration | Stripe, Paytm | Stripe has fees, Paytm less international |
| **Cloudinary** | Image hosting, CDN, optimization | AWS S3 | More complex setup, more infrastructure |
| **React Query** | Automatic caching, sync, error handling | Redux | Redux boilerplate-heavy |
| **Recharts** | React-native charting library, easy integration | Chart.js, D3 | Chart.js is canvas-based, D3 steep learning |

---

## 10. Future Enhancements

### 10.1 Short-term Enhancements (1-3 months)

1. **Payment Gateway Enhancements**
   - Implement payment verification webhook
   - Add Razorpay signature validation
   - Auto-update sale payment status after verification
   - Send payment receipt emails on successful payment
   - Add alternative payment gateways (Stripe, PayU, Paytm)

2. **Image Upload Enhancement**
   - Improve Cloudinary integration
   - Add image compression before upload
   - Image gallery for medicine photos
   - Generate barcodes for medicines

3. **Email Notifications**
   - Implement low-stock email alerts (currently has backend support)
   - Add frontend button to trigger email alerts
   - Payment confirmation emails
   - Stock update notifications
   - Consider Nodemailer as alternative to Resend

4. **Advanced Dashboard**
   - More detailed sales analytics
   - Revenue trend charts
   - Top-selling medicines analytics
   - Customer analytics (top buyers, frequency)
   - Expiring medicines warnings

5. **Sales & Invoice Enhancements**
   - Invoice generation (PDF)
   - Print invoice functionality
   - Sale status tracking (pending, completed, cancelled)
   - Refund/return management
   - Sale history export

### 10.2 Medium-term Enhancements (3-6 months)

6. **Medicine Management Enhancements**
   - Batch/Serial number tracking
   - FIFO inventory management
   - Supplier management linking
   - Purchase order tracking
   - Medicine category management UI
   - Bulk import/export medicines

7. **Inventory Audit**
   - Physical stock count module
   - Compare actual vs system count
   - Auto-adjustment with audit reasons
   - Audit history and reports
   - Stock discrepancy tracking

8. **Barcode/QR Code System**
   - Generate barcodes for medicines
   - QR code labels for inventory
   - Barcode scanner integration
   - Quick add to cart via barcode scanning

9. **User Management & Audit**
   - Granular role management (create custom roles)
   - Permission matrix UI
   - Audit logs for sensitive actions
   - User activity tracking
   - Login history

10. **Performance & Caching**
    - Database indexing optimization
    - Pagination for large datasets
    - Caching strategy for frequently accessed data
    - API response optimization

### 10.3 Long-term Enhancements (6-12 months)

11. **Prescription Management**
    - Upload/store customer prescriptions
    - Link prescriptions to sales
    - Prescription history per customer
    - Digital prescription generation
    - Prescription validation before sale

12. **Multi-branch & Multi-user Management**
    - Manage multiple pharmacy locations
    - Inter-branch inventory transfers
    - Centralized reporting
    - Branch-wise inventory tracking
    - Staff management per branch

13. **Financial & Tax Management**
    - GST/Tax calculation and tracking
    - Tax compliance reports
    - Invoice generation with tax details
    - Profit/loss analysis
    - COGS (Cost of Goods Sold) tracking
    - Vendor billing and payment tracking

14. **Advanced Analytics & Reporting**
    - ABC analysis (Pareto principle)
    - Demand forecasting
    - Stock rotation warnings
    - Just-in-time ordering recommendations
    - Customer purchase patterns
    - Seasonal trend analysis
    - PDF/Excel report export

15. **Loyalty & Customer Program**
    - Points for purchases
    - Redemption options
    - Tiered membership (Gold, Silver, Bronze)
    - Referral bonuses
    - Customer birthday discounts

16. **Mobile Application**
    - React Native / Flutter mobile app
    - Same backend API compatibility
    - Offline-first architecture
    - Push notifications
    - QR code scanning for stock

17. **Integration Capabilities**
    - Public API for third-party integrations
    - Webhook support
    - OAuth2 authentication
    - API documentation (Swagger/OpenAPI)
    - Insurance provider APIs
    - Supplier system integration

18. **AI/ML Features**
    - Demand forecasting models
    - Optimal reorder quantity calculation
    - Anomaly detection (unusual sales patterns)
    - Customer churn prediction
    - Price optimization

---

## 11. Deployment Considerations

### 11.1 Backend Deployment

**Environment Variables - Required:**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-min-32-chars (min 32 characters)
NODE_ENV=production
```

**Environment Variables - Optional (for features):**
```
# Cloudinary (for medicine image uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Razorpay (for online payment orders)
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# Resend Email (for low-stock alerts)
RESEND_API_KEY=...
ALERT_EMAIL_FROM=noreply@pharmacy.com
ALERT_EMAIL_TO=admin@pharmacy.com
```

**Note:** System works fine without optional environment variables. Features gracefully disable if not configured.

**Deployment Platforms:**
- **Heroku** (easy, built-in Node.js support)
- **Railway.app** (modern, free tier)
- **Render** (simple, good free tier)
- **AWS EC2** (scalable, complex)
- **DigitalOcean App Platform** (affordable)

**Pre-deployment Checklist:**
- [ ] Environment variables set in platform
- [ ] MongoDB Atlas cluster configured
- [ ] Database backups enabled
- [ ] CORS origins updated (production domain)
- [ ] JWT_SECRET is strong (> 32 chars)
- [ ] NODE_ENV = "production"
- [ ] Rate limiting adjusted for expected traffic
- [ ] Error logging configured (Sentry)
- [ ] SSL/HTTPS enforced

---

### 11.2 Frontend Deployment

**Build Process:**
```bash
npm run build  # Produces optimized dist/ folder
```

**Deployment Platforms:**
- **Vercel** (optimized for Next.js/Vite, free tier)
- **Netlify** (simple, free tier)
- **GitHub Pages** (free, basic)
- **AWS S3 + CloudFront** (scalable, CDN)

**Environment Variables for Frontend:**
```
VITE_API_URL=https://api.pharmacy.com
```

**Pre-deployment Checklist:**
- [ ] API_URL points to production backend
- [ ] Build succeeds without errors
- [ ] Production builds tested locally
- [ ] CSP headers configured
- [ ] Analytics configured (optional)
- [ ] Error tracking configured (optional)

---

### 11.3 Monitoring & Maintenance

**Recommended Tools:**
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Frontend session replay
- **New Relic**: Application performance monitoring
- **Uptime Robot**: Ping endpoint every 5 mins
- **Datadog**: Infrastructure monitoring

**Maintenance Tasks:**
- Weekly: Check error logs
- Monthly: Review API performance
- Monthly: Backup database
- Quarterly: Security updates
- Quarterly: Performance optimization

---

## 12. Security Best Practices Implemented

### 12.1 Authentication Security
- ✅ Passwords hashed with bcrypt (slow by design)
- ✅ JWT tokens with expiration (7 days)
- ✅ HTTP-only cookies prevent XSS theft
- ✅ Secure flag on cookies (HTTPS only in production)
- ✅ SameSite=Strict prevents CSRF

### 12.2 Network Security
- ✅ Helmet.js adds security headers
- ✅ CORS whitelisting prevents cross-origin attacks
- ✅ Rate limiting prevents brute force
- ✅ HTTPS enforced in production
- ✅ Input validation prevents injection

### 12.3 Data Security
- ✅ Sensitive fields excluded from responses (passwords)
- ✅ Database credentials in environment variables
- ✅ Cloudinary URLs are secure (HTTPS)
- ✅ Razorpay signature validation prevents forgery

### 12.4 Recommended Additional Measures
- Add request signing for critical endpoints
- Implement database encryption at rest
- Use API keys with expiration for external services
- Implement database transaction rollback on payment failure
- Add audit logs for all admin actions
- Implement Web Application Firewall (WAF)

---

## 13. Development Workflow

### 13.1 Local Setup

```bash
# Clone repository
git clone <repo-url>

# Backend setup
cd Backend
npm install
cp .env.example .env  # Configure with local MongoDB
npm run seed
npm run dev           # http://localhost:5000

# Frontend setup (new terminal)
cd FrontEnd
npm install
cp .env.example .env  # Configure to point to localhost backend
npm run dev           # http://localhost:5173

# Login with:
# Email: admin@pharmacy.com (from seed)
# Password: Admin@123
```

### 13.2 Project Folder Structure Explanation

```
pharmacy-system/
│
├── Backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── app.ts               # Express app configuration
│   │   ├── index.ts             # Entry point, DB connection, server start
│   │   ├── env.ts               # Environment variable validation
│   │   │
│   │   ├── config/              # Configuration files
│   │   │   ├── cors.config.ts
│   │   │   ├── cloudinary.config.ts
│   │   │   └── razorpay.config.ts
│   │   │
│   │   ├── constants/           # App-wide constants
│   │   │   └── index.ts
│   │   │
│   │   ├── controllers/         # Thin request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── medicine.controller.ts
│   │   │   ├── customer.controller.ts
│   │   │   ├── sale.controller.ts
│   │   │   └── payment.controller.ts
│   │   │
│   │   ├── services/            # Business logic & data access
│   │   │   ├── auth.service.ts
│   │   │   ├── medicine.service.ts
│   │   │   ├── customer.service.ts
│   │   │   ├── sale.service.ts
│   │   │   └── payment.service.ts
│   │   │
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── user.model.ts
│   │   │   ├── medicine.model.ts
│   │   │   ├── customer.model.ts
│   │   │   ├── sale.model.ts
│   │   │   └── index.ts         # Export all models
│   │   │
│   │   ├── routes/              # Express route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── medicine.routes.ts
│   │   │   ├── customer.routes.ts
│   │   │   ├── sale.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── index.ts         # Combine all routes
│   │   │
│   │   ├── middleware/          # Custom middleware functions
│   │   │   ├── auth.middleware.ts      # JWT verification
│   │   │   ├── error.middleware.ts     # Global error handler
│   │   │   ├── validate.middleware.ts  # Zod validation
│   │   │   ├── rateLimiter.middleware.ts
│   │   │   └── upload.middleware.ts    # Multer file handling
│   │   │
│   │   ├── validators/          # Zod schema definitions
│   │   │   ├── auth.validator.ts
│   │   │   ├── medicine.validator.ts
│   │   │   ├── customer.validator.ts
│   │   │   ├── sale.validator.ts
│   │   │   ├── common.validator.ts     # Shared validators (ObjectId)
│   │   │   └── payment.validator.ts
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   ├── apiError.ts      # Custom error class
│   │   │   ├── apiResponse.ts   # Response formatting
│   │   │   ├── asyncHandler.ts  # Async error wrapper
│   │   │   ├── sendEmail.ts     # Email utility
│   │   │   ├── uploadToCloudinary.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── types/               # TypeScript type definitions
│   │   │   ├── express.d.ts     # Extend Express namespace
│   │   │   └── streamifier.d.ts
│   │   │
│   │   ├── interfaces/          # Shared TypeScript interfaces
│   │   │   └── index.ts         # JwtPayload, etc.
│   │   │
│   │   └── DB/                  # Database initialization
│   │       ├── connect.ts       # MongoDB connection
│   │       └── seed.ts          # Create initial data
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── FrontEnd/                    # React + Vite UI
│   ├── src/
│   │   ├── main.tsx             # React DOM mount
│   │   ├── App.tsx              # Main app component with routing
│   │   ├── App.css / index.css  # Global styles
│   │   ├── vite-env.d.ts        # Vite environment types
│   │   │
│   │   ├── context/             # React context for state
│   │   │   └── AuthContext.tsx  # Global auth state
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useAuth.ts       # Hook to access AuthContext
│   │   │
│   │   ├── services/            # API client calls
│   │   │   ├── api.ts           # Axios instance + interceptors
│   │   │   ├── auth.service.ts  # Auth endpoints
│   │   │   ├── medicine.service.ts
│   │   │   ├── customer.service.ts
│   │   │   ├── sale.service.ts
│   │   │   └── payment.service.ts
│   │   │
│   │   ├── types/               # TypeScript interfaces
│   │   │   └── index.ts
│   │   │
│   │   ├── components/          # Reusable React components
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── common/
│   │   │   │   ├── Navbar.tsx         # Navigation bar
│   │   │   │   └── ProtectedRoute.tsx # Auth guard for routes
│   │   │   ├── customers/       # Customer components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   │   └── StockChart.tsx     # Chart visualization
│   │   │   └── inventory/       # Inventory components
│   │   │
│   │   ├── pages/               # Full-page components
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Dashboard.tsx    # Dashboard with analytics
│   │   │   ├── Inventory.tsx    # Medicines list & management
│   │   │   ├── Customers.tsx    # Customers management
│   │   │   └── Sales.tsx        # Sales transactions
│   │   │
│   │   └── utils/               # Frontend utility functions
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
└── README.md                    # Project readme
```

---

## 14. Common Use Cases & Workflows

### Scenario 1: Daily Sales Process

```
1. Pharmacist logs in (admin@pharmacy.com / Admin@123)
2. Navigates to Dashboard
   - Checks low-stock medicines
   - Reviews previous day's sales
3. Creates new sale:
   - Searches for customer (or creates new)
   - Selects medicine from dropdown
   - Enters quantity (system validates stock)
   - Confirms total price
4. Payment options:
   - Online: Completes Razorpay payment
   - Offline: Saves sale (marks as pending payment)
5. Receipt emailed to customer (if provided)
6. Inventory automatically updated
```

### Scenario 2: Low-Stock Management

```
1. Admin reviews Dashboard
2. Sees medicines below reorder level
3. Clicks "Send Low-Stock Alert"
4. System emails all staff with items to order
5. Updates medicine quantity after receiving new stock
6. Stock levels monitored daily
7. When stock exceeds threshold, alert stops
```

### Scenario 3: Adding New Medicine

```
1. Pharmacist clicks "Add Medicine" in Inventory
2. Fills form:
   - Name: "Aspirin 500mg"
   - Category: "Pain Relief"
   - Quantity: 100 units
   - Reorder Level: 20 units
   - Price: ₹5 per unit
   - Expiry Date: 2026-12-31
   - Image upload (optional, requires Cloudinary config)
3. System validates all fields
4. If Cloudinary configured: Image uploaded to Cloudinary
5. Medicine created in database
6. Appears in inventory table immediately
7. If Cloudinary not configured: Image upload skipped gracefully
```

### Scenario 4: Customer Analytics

```
1. Admin views Dashboard
2. Sees top-selling medicines chart
3. Sees sales trend graph
4. Exports report for review
5. Identifies:
   - Most profitable medicines
   - Seasonal trends
   - Best-selling categories
6. Makes reordering decisions based on data
```

---

## 15. Conclusion

The Pharmacy Management System is a comprehensive, modern solution for pharmacy operations. It automates inventory management, streamlines sales processes, integrates online payments, and provides valuable business insights through analytics.

The system is built with:
- **Scalability** in mind (can grow from single pharmacy to multi-branch)
- **Security** as a top priority (JWT, bcrypt, input validation)
- **User experience** that's intuitive and efficient
- **Modern technologies** that are actively maintained
- **Extensibility** to add features without breaking existing code

With the planned enhancements, this system can evolve into a comprehensive pharmacy business management platform with advanced features like prescription management, loyalty programs, insurance integration, and AI-driven analytics.

---

## 16. Quick Reference Guide

### Important Commands

```bash
# Backend
npm run dev                 # Start development server
npm run seed                # Populate initial data
npm run typecheck           # Check TypeScript errors
npm start                   # Start production server

# Frontend
npm run dev                 # Start Vite dev server
npm run build               # Build for production
npm run preview             # Preview production build
```

### Key Files & Locations

| Task | File |
|------|------|
| Add new API endpoint | `routes/[resource].routes.ts` + `controllers/[resource].controller.ts` + `services/[resource].service.ts` |
| Change database schema | `models/[resource].model.ts` |
| Add validation rule | `validators/[resource].validator.ts` |
| Add middleware | `middleware/[name].middleware.ts` |
| Add new page | `pages/[PageName].tsx` + update `App.tsx` routing |
| Make API call | `services/[resource].service.ts` on backend, `services/[resource].service.ts` on frontend |
| Add component | `components/[category]/[ComponentName].tsx` |

---

## 17. Support & Debugging

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGO_URI` in `.env`
   - Verify MongoDB is running (local) or cluster is accessible (Atlas)
   - Ensure IP whitelist includes your machine (Atlas)

2. **Token Expired**
   - Token valid for 7 days by default
   - Refresh by logging in again
   - Check `JWT_SECRET` matches between login and protected endpoints

3. **CORS Error**
   - Verify frontend and backend URLs match `corsOptions`
   - Check `VITE_API_URL` in frontend `.env`
   - Ensure backend is running

4. **Image Upload Fails**
   - Check `CLOUDINARY_CLOUD_NAME` and API keys
   - Verify image file size < 5MB
   - Check file type is jpg/png/webp

5. **Payment Gateway Errors**
   - Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Test mode vs live mode
   - Check Razorpay account settings

---

**End of Overview Document**

This comprehensive overview covers every aspect of the Pharmacy Management System project and is ready to be shared with ChatGPT or other AI tools for further analysis, enhancement suggestions, or technical discussions.
