

### 1.🛍️ E‑Commerce & HR Management Platform (NTI Backend Exam)

> A Node.js backend that combines an E‑Commerce system (products, cart, orders) with an HR Management system (staff, attendance, salary).  
> **Built for the NTI Node.js Backend Development Exam** – includes Cloudinary image uploads but no real‑time notifications (planned for future).

---

## ✅ Implemented Features

### Core Requirements (100%)
- **Authentication** – Signup, login, email verification (Nodemailer), password reset, JWT (access + refresh), role‑based access (user/admin)
- **User Profile** – View/update profile, upload avatar (Cloudinary), soft delete account
- **E‑Commerce**  
  - Categories & subcategories (admin CRUD, public listing)  
  - Products (admin CRUD, auto soft‑delete when stock = 0)  
  - Product filtering, pagination, sorting (price, name, date)  
  - Shopping cart (add, update quantity, remove, clear)  
  - Order checkout (Cash on Delivery only) with stock deduction  
- **HR Management**  
  - Staff management (admin CRUD)  
  - Daily check‑in/checkout with late/absence deductions  
  - Salary calculation (daily salary × working days – deductions + adjustments)  
  - Monthly salary payment tracking  
- **Bonus 2 – Cloud Storage** ✅  
  - Upload product images & user avatars to Cloudinary  
  - Automatic deletion of images when product/user is soft‑deleted  
  - Optimized image URLs (transformations for size/quality)

### ❌ Not Implemented (Marked as Future)
- Module 3 – Real‑time notifications (Socket.io)  
- Bonus 1 – Cypress E2E tests  
- Bonus 3 – Ticket support system  
- Stripe payment (only COD is available)

---

## 🛠️ Tech Stack

| Technology            | Purpose                          |
|-----------------------|----------------------------------|
| Node.js + Express     | Backend framework                |
| MongoDB + Mongoose    | Database & ODM                   |
| JSON Web Tokens       | Authentication / Authorization   |
| bcryptjs              | Password hashing                 |
| Joi                   | Input validation                 |
| Nodemailer            | Email verification               |
| Multer                | File uploads                     |
| Cloudinary            | Image storage & optimization     |
| Helmet, CORS, etc.    | Security & middleware            |

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Copy `.env.example` to `.env` and fill in your values:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce_exam

# JWT
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=24h

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary (Bonus)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).

### 4. Start MongoDB (local or cloud)
```bash
mongod
```

### 5. Run the server
```bash
npm run dev      # development with nodemon
npm start        # production
```

---

## 📚 API Documentation

Base URL: `http://localhost:5000/api/v1`

### 🔐 Authentication

| Method | Endpoint                     | Description               | Access |
|--------|------------------------------|---------------------------|--------|
| POST   | `/auth/signup`               | Register new user         | Public |
| POST   | `/auth/login`                | Login (returns tokens)    | Public |
| POST   | `/auth/verify-email/:token`  | Verify email address      | Public |
| POST   | `/auth/resend-verification`  | Resend verification email | Public |
| POST   | `/auth/forgot-password`      | Request password reset    | Public |
| POST   | `/auth/reset-password/:token`| Reset password            | Public |

### 👤 User Profile

| Method | Endpoint                 | Description               | Access |
|--------|--------------------------|---------------------------|--------|
| GET    | `/users/profile`         | Get own profile           | User   |
| PUT    | `/users/profile`         | Update name/phone/avatar  | User   |
| DELETE | `/users/profile`         | Soft delete account       | User   |
| POST   | `/users/upload-avatar`   | Upload avatar (Cloudinary)| User   |

### 🗂️ Categories (Admin only for write)

| Method | Endpoint                     | Description          | Access     |
|--------|------------------------------|----------------------|------------|
| POST   | `/categories`                | Create category      | Admin      |
| PUT    | `/categories/:id`            | Update category      | Admin      |
| DELETE | `/categories/:id`            | Soft delete category | Admin      |
| GET    | `/categories`                | List all (with subs) | Public     |
| GET    | `/categories/:id/subcategories` | Subcategories by category | Public |
| GET    | `/subcategories/:id`         | Subcategory details  | Public     |

### 📦 Products

| Method | Endpoint                              | Description                       | Access     |
|--------|---------------------------------------|-----------------------------------|------------|
| POST   | `/admin/products`                     | Add product (with Cloudinary images) | Admin   |
| PUT    | `/admin/products/:id`                 | Update product                    | Admin      |
| DELETE | `/admin/products/:id`                 | Soft delete product (removes images) | Admin  |
| PATCH  | `/admin/products/:id/stock`           | Update stock quantity             | Admin      |
| GET    | `/products`                           | List active products (filter, sort, page) | Public |
| GET    | `/products/:id`                       | Get single product                | Public     |
| GET    | `/products/category/:categoryId`      | Filter by category                | Public     |
| GET    | `/products/subcategory/:subcategoryId`| Filter by subcategory             | Public     |

**Query params for listing**  
`?page=1&limit=10&minPrice=10&maxPrice=100&sort=price_asc`  
Sort options: `price_asc`, `price_desc`, `createdAt_asc`, `createdAt_desc`, `name_asc`, `name_desc`

### 🛒 Cart

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/cart`                   | Add item to cart          |
| GET    | `/cart`                   | View cart                 |
| PUT    | `/cart/:productId`        | Update item quantity      |
| DELETE | `/cart/:productId`        | Remove item               |
| DELETE | `/cart`                   | Clear entire cart         |

### 📄 Orders (Cash on Delivery only)

| Method | Endpoint                      | Description                     | Access    |
|--------|-------------------------------|---------------------------------|-----------|
| POST   | `/orders/checkout`            | Checkout cart (COD)             | User      |
| GET    | `/orders`                     | Get my orders                   | User      |
| GET    | `/orders/:id`                 | Get order details               | User      |
| GET    | `/admin/orders`               | Get all orders                  | Admin     |
| PATCH  | `/admin/orders/:id/status`    | Update order status             | Admin     |

### 👔 HR Management (Staff & Attendance)

| Method | Endpoint                                           | Description                     | Access |
|--------|----------------------------------------------------|---------------------------------|--------|
| POST   | `/admin/staff`                                     | Add staff member                | Admin  |
| GET    | `/admin/staff`                                     | List all staff                  | Admin  |
| PUT    | `/admin/staff/:id`                                 | Update staff                    | Admin  |
| DELETE | `/admin/staff/:id`                                 | Soft delete staff               | Admin  |
| POST   | `/staff/checkin`                                   | Check in for the day            | Staff  |
| POST   | `/staff/checkout`                                  | Check out for the day           | Staff  |
| POST   | `/admin/staff/:id/deductions`                      | Add deduction                   | Admin  |
| GET    | `/admin/staff/:id/deductions`                      | Get staff deductions            | Admin  |
| GET    | `/admin/staff/:id/salary/:month`                   | Calculate monthly salary        | Admin  |
| POST   | `/admin/staff/:id/salary/:month/pay`               | Mark salary as paid             | Admin  |

> **Month format**: `YYYY-MM` (e.g., `2024-03`)

---

## ☁️ Cloudinary Integration (Bonus Completed)

- **Product images** – uploaded via `POST /admin/products` (field `images`).
- **User avatars** – uploaded via `POST /users/upload-avatar`.
- **Auto‑cleanup** – when a product or user is soft‑deleted, all associated images are automatically removed from Cloudinary.
- **Optimized URLs** – all image URLs include transformations (e.g., `w_500,h_500,c_fill`) for faster loading.

---

## 🚧 Future Improvements

- **Real‑time notifications (Socket.io)** – Admin broadcast of offers/promotions to all connected users.
- **Stripe payment integration** – Credit card checkout with webhook confirmation.
- **Ticket support system** – Users open tickets, admins reply.
- **Cypress E2E tests** – Cover auth, cart, checkout, and admin flows.

---

## 📁 Project Structure (Simplified)

```
├── src
│   ├── controllers       # Route handlers
│   ├── models            # Mongoose schemas (User, Product, Order, Staff, etc.)
│   ├── routes            # API routes
│   ├── middlewares       # Auth, validation, upload, error handling
│   ├── utils             # Email, Cloudinary, JWT helpers
│   ├── validations       # Joi schemas
│   └── app.js            # Express app setup
├── .env.example
├── package.json
└── README.md
```

---

## 🧪 Testing (Manual)

No automated test suite is included. You can test the endpoints using [Postman](https://www.postman.com/) or `cURL`.

---

## 📄 License

MIT

---

**Built with ❤️ for the NTI Node.js Backend Exam**  
*“Build something you’re proud of (ma3 eny 2a4ok XD)”*
```
