# Phase 9 — Account & Order History

## Goal
Authenticated users can view their order history and individual order details.

## Steps

### 9.1 Account Orders API
Create `app/api/account/orders/route.ts` (GET, auth required):
- Fetch all orders for current user (from session)
- Order by `createdAt` descending
- Return summary: order ID, date, total, status, item count

### 9.2 Account Order Detail API
Create `app/api/account/orders/[id]/route.ts` (GET, auth required):
- Fetch single order
- **Must verify ownership**: `order.userId === session.user.id`, else 403
- Return full order: items, shipping address, status, total, createdAt

### 9.3 My Account Page
Create `app/(account)/account/page.tsx` (protected):
- Page title: "My Orders"
- Table/list of orders:
  - Order ID (truncated), Date, Total (₱), Status, Item Count
  - Click row → navigate to `/account/orders/[id]`
- Empty state: "No orders yet" + link to browse products

### 9.4 Order Detail Page
Create `app/(account)/account/orders/[id]/page.tsx` (protected):
- Fetch order from API
- Show:
  - Order ID and date
  - Status badge (paid/shipped/delivered)
  - Items table: Product Name, Size, Quantity, Price, Subtotal
  - Shipping Address (formatted)
  - Total amount
- Back link to /account

## Estimated Files
- `app/api/account/orders/route.ts`
- `app/api/account/orders/[id]/route.ts`
- `app/(account)/account/page.tsx`
- `app/(account)/account/orders/[id]/page.tsx`
