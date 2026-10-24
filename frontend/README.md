# StockTrack Management System

StockTrack is a full-stack inventory and stock management application built with the MERN stack. It provides authenticated, account-specific management of suppliers, products, stock movements, sales, reorder planning, analytics, reports, profile information, and application preferences.

## Key Features

- User registration, login, logout, current-user session handling, and protected routes
- Account-specific data isolation
- Supplier management
- Product management with SKU, category, pricing, stock, minimum-stock threshold, and supplier assignment
- Stock In, Stock Out, and inventory adjustment workflows
- Persistent inventory transaction history
- Sales recording with revenue calculation and automatic stock reduction
- Low-stock and out-of-stock monitoring
- Dead-stock identification with a configurable/default inactivity threshold
- Persistent reorder plans and reorder status workflow
- Dashboard metrics and inventory health information
- Sales and product analytics
- Business reports and product export
- Profile updates and password management
- Per-user preferences such as dark mode and compact tables
- Responsive React interface using CSS Modules

## Technology Stack

### Frontend

- React
- React Router
- Axios
- CSS Modules
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Cookie-based authentication support

## Project Architecture

```text
StockTrack
|
|-- frontend/
|   |-- src/
|       |-- api/
|       |-- components/
|       |-- context/
|       |-- hooks/
|       |-- layouts/
|       |-- pages/
|       |-- routes/
|       |-- utils/
|
|-- backend/
    |-- src/
        |-- config/
        |-- controllers/
        |-- middleware/
        |-- models/
        |-- routes/
        |-- services/
        |-- utils/
```

## Core Modules

### Authentication

StockTrack protects business routes through authenticated sessions. The frontend loads the current user and restricts dashboard pages to authenticated accounts.

### Suppliers

Users can maintain supplier records and associate suppliers with products. Supplier relationships are validated on the backend for the authenticated account.

### Products

Products contain information such as:

- Product name
- SKU
- Category
- Supplier
- Price
- Current stock
- Minimum stock
- Last sale date

Existing product stock is changed through inventory operations rather than ordinary product editing.

### Inventory

Inventory operations maintain persistent stock history. Supported transaction concepts include:

```text
STOCK_IN
STOCK_OUT
ADJUSTMENT
SALE
SALE_REVERSAL
```

Stock-out operations reject quantities that exceed available stock.

### Sales

Recording a sale creates a persistent sale record, calculates revenue, reduces product stock, updates the product's last-sale date, and creates the related SALE inventory transaction.

### Low Stock and Dead Stock

StockTrack identifies low-stock and out-of-stock products from configured minimum-stock levels. Dead-stock reporting uses an inactivity threshold, with 90 days configured as the default in the backend constants.

### Reorder Plans

Reorder plans help organize replenishment for products below their configured minimum stock. Supported plan statuses are:

```text
DRAFT
ORDERED
COMPLETED
CANCELLED
```

Creating or completing a reorder plan does not automatically increase inventory. Received stock is recorded through the Inventory module.

### Analytics and Reports

The application summarizes operational data such as inventory value, stock conditions, sales activity, revenue, product performance, and inventory movements. Report data is grounded in persistent backend records.

### Profile and Settings

Users can maintain account details and preferences. Preferences include settings such as dark mode and compact-table presentation.

## API Base URL

The frontend uses the environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

If it is not provided, the current frontend API client uses `http://localhost:5000/api/v1` as its development fallback.

## Environment Configuration

Create a `.env` file in the backend and define the environment variables required by your authentication and database configuration.

Typical StockTrack configuration includes values for:

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY=YOUR_ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRY=YOUR_REFRESH_TOKEN_EXPIRY
NODE_ENV=development
```

Do not commit real passwords, database credentials, JWT secrets, or production environment files to source control.

## Running the Project Locally

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The current backend defaults to port `5000` when `PORT` is not set.

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in the terminal.

## Production Build

From the frontend directory:

```bash
npm run build
```

Before deployment, configure production environment variables, the production client URL, database credentials, and authentication secrets.

## Main Backend Routes

The completed project is organized around API areas for:

```text
/api/v1/auth
/api/v1/users
/api/v1/suppliers
/api/v1/products
/api/v1/inventory
/api/v1/sales
/api/v1/reports
/api/v1/reorders
/api/v1/healthcheck
```

Protected business endpoints are associated with the authenticated user.

## Important Business Rules

- A user's business data is isolated from other authenticated users.
- Product SKUs are handled as account-specific product identifiers in the implemented product workflow.
- Product stock should be changed through Inventory or Sales workflows after product creation.
- Stock Out and Sale operations cannot exceed currently available stock.
- Supplier references are validated against the authenticated user's suppliers.
- Inventory and sales history remains persistent in MongoDB.
- Reorder plans represent purchasing intentions and do not themselves add stock.

## Recommended End-to-End Test Flow

```text
Register / Login
       |
       v
Create Supplier
       |
       v
Create Product
       |
       v
Stock In / Stock Out
       |
       v
Record Sale
       |
       v
Low Stock / Dead Stock
       |
       v
Create Reorder Plan
       |
       v
Analytics / Reports
       |
       v
Profile / Settings
       |
       v
Logout / Login
       |
       v
Verify Persistence
```

Repeat the important data checks with a second account to verify account isolation.

## Project Report

A Mini Project Report for StockTrack has also been prepared using the prescribed academic report structure. Add final application screenshots and student/guide details before formal submission.

## Future Enhancements

Possible future work includes:

- Organisation-level roles and permissions
- Barcode or QR-based stock operations
- Purchase orders and goods-receipt workflows
- Automated notifications for low-stock conditions
- More advanced time-series analytics and demand forecasting
- Automated frontend/backend test suites
- CI/CD and production monitoring

## Security Notes

- Keep JWT secrets and database credentials outside source control.
- Use environment variables for deployment-specific configuration.
- Restrict production CORS to trusted frontend origins.
- Use HTTPS in production.
- Do not expose MongoDB credentials in frontend code.

## License

This project was developed as an academic Mini Project. Add a license file if you intend to distribute or reuse the project publicly.
