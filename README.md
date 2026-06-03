# AasaMedChem Inventory and Order Management System

This is a Next.js application built for the AasaMedChem hackathon assignment. It provides an inventory and order management system with a robust unit conversion strategy and role-based access.

## Features

- **Role-based Authentication**: Admin and Seller roles using NextAuth.js (Credentials provider).
- **Unit Conversion Strategy**: Built-in strategy to seamlessly convert between different units (g, kg, L, mL, count) while preventing floating-point errors.
- **Product Catalog**: Sellers can browse products, select their preferred display unit, and see precise price calculations in INR before ordering.
- **Order Management**: Admins can view all orders placed across the system. Sellers can view their own order history.
- **High-Precision Pricing**: PostgreSQL `DECIMAL(16, 4)` and Prisma `Decimal` are used to handle high-precision calculations and large monetary values without precision loss.
- **Minimalistic UI**: Built with Tailwind CSS, Shadcn UI, and Lucide React icons.

## Tech Stack & Architecture

- **Framework:** Next.js 14+ (App Router)
- **Database:** PostgreSQL (Neon Serverless Postgres)
- **ORM:** Prisma
- **Styling:** Tailwind CSS & Shadcn UI
- **Authentication:** NextAuth.js
- **Math/Precision:** `decimal.js`

### Unit Storage and Conversion Strategy

To ensure absolute consistency and prevent floating-point errors, this system implements a **Base Unit** strategy:

1. **Internal Storage (Database):**
   - **Weight** is always stored in grams (`g`).
   - **Volume** is always stored in milliliters (`mL`).
   - **Count** is always stored as items (`unit`).

2. **Prices & Inventory:**
   - The database stores `pricePerBaseUnit` (e.g., INR per gram) and `inventoryBaseQty` (e.g., total grams in stock) using the `DECIMAL(16, 4)` type.

3. **Conversions (Code Level):**
   - When a Seller views a product in `kg`, the system takes the `pricePerBaseUnit` (per gram) and multiplies it by 1000 to display the price per kg.
   - When placing an order for "5 kg", the frontend calculates `5 * 1000 = 5000 grams`. The order is saved internally as `baseQty = 5000` while retaining `requestedQty = 5` and `requestedUnit = KG` for display purposes in the UI.

This design decouples display logic from internal logic, making it trivially easy to add new units (e.g., metric tons, milligrams) in the future without altering historical data or risking rounding errors in the database.

## Setup Instructions

### 1. Prerequisites

- Node.js (v18+)
- npm or pnpm
- Docker (optional, for local PostgreSQL)

### 2. Environment Variables

Create a `.env` file in the root directory based on the following template. If you are using Neon, provide your connection string here.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/assammed_db?schema=public"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

You can use the included `docker-compose.yml` to spin up a local PostgreSQL instance:
```bash
docker-compose up -d
```

Push the database schema to the database:
```bash
npx prisma db push
```

Seed the database with initial users and products:
```bash
npx tsx prisma/seed.ts
```

**Test Credentials:**
- **Admin**: `admin@test.com` / `admin123`
- **Seller**: `seller@test.com` / `seller123`

### 4. Running the Application

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Navigate to `http://localhost:3000` and log in with the test credentials.

## Deployment to Vercel

1. Push this repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and import the repository.
3. In the Environment Variables section, add `DATABASE_URL` (pointing to your Neon DB) and a generated `NEXTAUTH_SECRET`.
4. Vercel will automatically detect Next.js and build the application. Prisma schema will be generated during the `npm install` phase automatically.
5. Deploy.
