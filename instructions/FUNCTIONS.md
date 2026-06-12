# FUNCTIONS.md – Main Functionalities of the Sneaker Store Portfolio

> **Project:** Modern Full‑Stack Sneaker Store  
> **Purpose of this file:** Describe the complete feature set and user journeys, separate from technical constraints.

---

## 📝 Overview

This is a fully functional, demo sneaker e‑commerce site built to showcase modern full‑stack development. Users can browse a catalog of sneakers, filter by brand/size/price, add items to a cart, register an account, pay with a test credit card, and view their order history. Administrators have a dedicated area to manage the product inventory and view all customer orders.

---

## 👥 User Roles

| Role       | Capabilities                                                                 |
|------------|------------------------------------------------------------------------------|
| Guest      | Browse products, filter/search, view product details, add to cart (cart is temporary, lost on browser close). |
| Customer   | Everything a guest can do, plus: create account, log in, complete checkout with payment, see personal order history and order details. |
| Admin      | Everything a customer can do, plus: access admin dashboard, create/edit/delete products (including sizes and stock), view all customer orders. |

---

## 🛒 Core Features

### 1. Product Catalog
- Grid display of sneakers with thumbnail image, name, brand, and price.
- Server‑side pagination (8 products per page).
- Dynamic filtering by **brand**, **size**, and **price range**. Active filters appear in the URL query string so pages can be bookmarked or shared.
- Product detail page with image gallery (click thumbnail to swap main image), full description, available sizes shown as buttons, stock status, and price.

### 2. Cart Management
- **Client‑side only** shopping cart (persisted in the browser’s localStorage during the session).
- Add items to cart by selecting a specific size; each size variant is treated as a separate line item.
- A slide‑out drawer from the right shows the cart contents, with quantity adjusters and remove buttons.
- Cart total is automatically calculated.
- Cart icon in the navigation bar shows the current number of items.

### 3. User Authentication
- Registration with email and password (minimum 8 characters, confirm password field).
- Login with email and password.
- Session handled securely – no email verification required for this demo.
- Protected pages (checkout, account) redirect unauthenticated users to login.

### 4. Checkout & Payment
- Only accessible to logged‑in users.
- Checkout page displays a summary of cart items and a simple shipping address form (name, address, city, zip, country).
- On “Place Order”, the user is redirected to a **Stripe Checkout** page (test mode) with the cart items as line items.
- After successful payment, Stripe redirects to the **order success page** showing the order ID, items, and total.
- Behind the scenes, a webhook marks the order as “paid”, stores it in the database with the shipping address, and reduces stock for the purchased size variants.
- A test card number (`4242 4242 4242 4242`) is displayed on the checkout page so anyone can test the full purchase flow without real money.

### 5. Customer Account
- `My Account` page lists all past orders in reverse chronological order (order ID, date, total, status).
- Clicking an order shows its details: line items with product name, size, quantity, and price, plus the shipping address.
- No profile editing or password change in scope.

### 6. Admin Dashboard
- Manually seeded admin account (default credentials: `admin@example.com` / `password123`).
- Admin link appears in the header only for users with the admin role.
- **Product Management:**
  - View a table of all products with options to create, edit, or delete.
  - Create new product: enter name, description, brand, price, image URLs (comma-separated or multiple inputs), and define sizes with stock quantities.
  - Edit an existing product (pre‑filled form) and update any field.
  - Delete a product entirely.
- **Order Management:**
  - View all customer orders in a table (filter by status).
  - See order details (items, address, status). No ability to modify orders.

---

## 🖥️ Page‑by‑Page Breakdown

| Page                  | Who can access | Description |
|-----------------------|----------------|-------------|
| Home (`/`)            | Everyone       | Hero banner and a hand‑picked “Featured Products” section (4 products). |
| Products (`/products`)| Everyone       | Complete catalog with filters and pagination. |
| Product detail (`/products/[id]`) | Everyone | Full product info, image gallery, size selector, add‑to‑cart button. |
| Login (`/login`)      | Everyone       | Email/password login form. |
| Register (`/register`)| Everyone       | Email/password registration form. |
| Checkout (`/checkout`)| Authenticated  | Cart summary, shipping address form, Stripe redirect button. Test card info shown. |
| Success (`/success`)  | Authenticated  | Order confirmation after Stripe payment. |
| Account (`/account`)  | Authenticated  | List of user’s orders. |
| Order detail (`/account/orders/[id]`) | Authenticated (owner only) | Full order breakdown. |
| Admin dashboard (`/admin`) | Admin only | Main hub with links to product list and order list. |
| New product (`/admin/products/new`) | Admin only | Form to create a new product with variants. |
| Edit product (`/admin/products/[id]/edit`) | Admin only | Pre‑filled form to update product. |

---

## 💳 Complete User Flow (for recruiters / testers)

1. Visit the site as a guest → browse the catalog → filter by size 42 → see filtered results.
2. Click a product → select an available size → add to cart. Cart drawer opens, shows the item.
3. Continue browsing, add another product with a different size.
4. Click “Checkout” → prompted to log in / register. Register with a fake email and password.
5. After registration, redirected to checkout → see cart items and fill in any shipping address.
6. Click “Pay with Card” → enter test card number `4242 4242 4242 4242`, any future expiry, any CVC.
7. Confirm payment → redirected to success page showing order details.
8. Navigate to “My Account” → see the order listed. Click to view details.
9. Log out, then log in as admin (`admin@example.com` / `password123`) → click Admin.
10. In admin, view the order in the orders list, create a new product, edit an existing one, delete an old one.

---

### 7. AI Product Assistant Bot
- Floating chat bubble visible on every page.
- Answers natural language questions about products, sizing, brands, and availability.
- Powered by Groq API with streaming responses.
- Chat history persists in localStorage during session.
- Available to guests and logged-in users.
- Suggested prompts shown on first open.

---

## 📦 Seed Data

The database is pre‑seeded with **12 sneaker products** from well‑known brands (for demo purposes) with multiple sizes per product and realistic stock numbers. All images are placeholder URLs from picsum. This gives the catalog a real‑world feel without needing any image uploads.