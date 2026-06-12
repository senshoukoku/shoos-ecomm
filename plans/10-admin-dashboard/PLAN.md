# Phase 10 — Admin Dashboard

## Goal
Admin-only area for managing products and viewing all customer orders.

## Steps

### 10.1 Admin Product API
Create `app/api/admin/products/route.ts`:
- **GET**: List all products (no pagination needed, < 50 items)
- **POST**: Create product with variants
  - Body: `{ name, description, brand, price, imageUrls: string[], variants: [{ size, stock }] }`
  - Create Product + ProductVariants in transaction

Create `app/api/admin/products/[id]/route.ts`:
- **PUT**: Update product and variants
  - Delete old variants, create new ones (replace strategy)
- **DELETE**: Delete product (cascades to variants, fails if orders reference it? — spec doesn't mention, just delete)

### 10.2 Admin Orders API
Create `app/api/admin/orders/route.ts` (GET, admin only):
- List all orders with user email
- Optional filter: `?status=paid|shipped|delivered`
- Order by `createdAt` descending

### 10.3 Admin Guard
Create `components/admin/AdminGuard.tsx`:
- Client component that checks session role
- If not admin: show "Access Denied" or redirect
- Wrap admin pages with this

### 10.4 Admin Dashboard Page
Create `app/admin/page.tsx`:
- Title: "Admin Dashboard"
- Quick links:
  - "Manage Products" → `/admin/products`
  - "View Orders" → `/admin/orders`
- Summary cards: total products, total orders, pending orders (optional)

### 10.5 Product List Page
Create `app/admin/products/page.tsx`:
- Table: Name, Brand, Price, Variants count, Actions (Edit, Delete)
- "Add Product" button → `/admin/products/new`
- Delete: confirm dialog, then call DELETE API, refresh list
- Edit: navigate to `/admin/products/[id]/edit`

### 10.6 Create Product Page
Create `app/admin/products/new/page.tsx`:
- Form fields: Name, Description, Brand, Price
- Image URLs: dynamic list (add/remove URL inputs)
- Variants: dynamic list (size dropdown + stock number input per variant)
- Submit → POST to `/api/admin/products` → redirect to product list

### 10.7 Edit Product Page
Create `app/admin/products/[id]/edit/page.tsx`:
- Same form as Create but pre-filled with existing data
- Submit → PUT to `/api/admin/products/[id]` → redirect to product list

### 10.8 Admin Orders Page
Create `app/admin/orders/page.tsx`:
- Table: Order ID, Customer Email, Date, Total, Status
- Status filter (All, Paid, Shipped, Delivered)
- Click row → navigate to order detail view
- Order detail: items, shipping address, status, total (read-only)

## Estimated Files
- `app/api/admin/products/route.ts`
- `app/api/admin/products/[id]/route.ts`
- `app/api/admin/orders/route.ts`
- `components/admin/AdminGuard.tsx`
- `app/admin/page.tsx`
- `app/admin/products/page.tsx`
- `app/admin/products/new/page.tsx`
- `app/admin/products/[id]/edit/page.tsx`
- `app/admin/orders/page.tsx`
