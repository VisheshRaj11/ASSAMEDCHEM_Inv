# AasaMedChem Inventory & Order Management System

Welcome to the AasaMedChem project! If you've been "vibe coding" along and want to understand exactly what makes this project tick, this document is for you. 

This application is a robust, full-stack Next.js web application designed to handle complex inventory and order management specifically tailored for medical and chemical supplies, where precise unit conversions (like Grams to Kilograms) are absolutely critical.

---

## 🔑 Test Credentials

The database has been seeded with two types of users to demonstrate Role-Based Access Control (RBAC). You can log in using these credentials at `http://localhost:3000`:

| Role | Email | Password | What they can do |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `admin123` | View total sales, manage the global product inventory, and see all orders placed by any seller. |
| **Seller** | `seller@test.com` | `seller123` | Browse the dynamic product catalog, select units, calculate pricing, and place orders. |

---

## ⚖️ The Magic: How Measuring Units Work

When dealing with chemicals, floating-point math errors (e.g., `0.1 + 0.2 = 0.30000000000000004`) are dangerous. To solve this, this project uses the **Base Unit Strategy** combined with High-Precision **Decimals**.

### 1. The Database Logic
Instead of saving a product as "2.5 Kilograms" or "1.5 Liters", the database normalizes *everything* to its smallest common denominator, called the **Base Unit**:
- **Weight** is always stored in **Grams (g)**
- **Volume** is always stored in **Milliliters (mL)**
- **Items** are stored as **Counts (unit)**

In PostgreSQL (via Prisma), we use the `DECIMAL(16, 4)` type. This guarantees absolute mathematical precision down to 4 decimal places for both quantities and monetary prices.

### 2. The Frontend Logic (The Vibe)
If an Admin adds "Sulfuric Acid" priced at **₹0.25 per Milliliter**, here is how the frontend interacts with the Seller:
1. The Seller views the catalog. They want to buy in **Liters**.
2. The UI (`src/lib/units.ts`) takes the base price (₹0.25) and multiplies it by 1,000. It shows the Seller: **₹250.00 per Liter**.
3. The Seller orders **5 Liters**.
4. The frontend calculates the true price (`5 * 250 = ₹1250`) and sends the order to the API.
5. The API receives "5 Liters", scales it back to the base unit (`5000 Milliliters`), and deducts 5000 from the database inventory!

*This means we never lose track of inventory, and you can easily add "Tons" or "Metric Drops" in the future without ever having to migrate your existing database.*

---

## 🗺️ Application Routes & Layouts

Here is how the Next.js App Router (`src/app/`) is organized:

### Public Routes
- `/login`: The entry point. It features a beautiful, glassmorphic UI card on top of a global radial-dotted background. It uses NextAuth to authenticate the user and redirect them.

### Protected Routes (The Dashboard)
All routes inside `/dashboard` are protected. If you try to visit them without logging in, Next.js Middleware automatically bounces you back to `/login`.

- **`/dashboard` (Overview & Catalog)**
  - If you are an **Admin**, this page shows a high-level statistical overview of the entire system (Total Products, Total Orders).
  - If you are a **Seller**, this page renders the **Product Catalog**, where you can search for chemicals and click "Order Now" to trigger the dynamic unit converter dialog.
- **`/dashboard/products` (Admin Only)**
  - A clean table listing every product in the database, its Base Unit, Price per Base Unit, and exact remaining Inventory.
- **`/dashboard/orders` (Admin Only)**
  - A comprehensive ledger of every single order placed across the application. It shows who ordered what, when, and the exact unit conversion that took place.
- **`/dashboard/my-orders` (Seller Only)**
  - A personal ledger for Sellers to review the status and total cost of their previous orders.

---

## 🔌 API Endpoints Explained

All backend logic lives in `src/app/api/`. These are Serverless Node.js endpoints.

### `POST /api/auth/[...nextauth]`
- **What it does:** Handles the NextAuth credential flow. 
- **How it works:** When a user submits the login form, this endpoint searches the Prisma database for the user, checks if the password matches, and issues a secure encrypted JWT Cookie to the browser to keep them logged in.

### `POST /api/orders`
- **What it does:** The engine of the purchasing system. It securely places a new order and deducts inventory.
- **How it works:**
  1. It first verifies the user's secure NextAuth session.
  2. It receives the `productId`, `requestedQty` (e.g., 5), and `requestedUnit` (e.g., "KG").
  3. It fetches the real `pricePerBaseUnit` directly from the database (so users can't hack the frontend to send fake prices).
  4. It uses our unit utility to convert the requested amount into the Base Amount (e.g., 5000 Grams).
  5. It initiates a **Prisma Database Transaction**. This ensures that if the server crashes halfway through, no data is corrupted.
  6. Inside the transaction, it creates the `Order`, attaches the `OrderItem`, and strictly decrements the `Product.inventoryBaseQty` by the calculated Base Amount.
  7. Returns a `201 Success` and the new Order ID!

---

## 🚀 Running the Project Locally

If you want to spin this up on a new machine:

1. **Install Packages:**
   ```bash
   npm install
   ```
2. **Setup the Database:** Ensure your `.env` has your Neon `DATABASE_URL`. Push the Prisma schema:
   ```bash
   npx prisma db push
   ```
3. **Seed the Database (Add Products & Users):**
   ```bash
   npx tsx prisma/seed.ts
   ```
4. **Start the App:**
   ```bash
   npm run dev
   ```

*Happy Coding!*
