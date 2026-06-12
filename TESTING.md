# Manual Testing Guide

Follow these steps to manually verify the complete user flow.

---

## 1. Browse Catalog as Guest

1. Visit `/products`
2. Verify products are displayed in a grid (1 col on mobile, 2 cols on tablet, 4 cols on desktop)
3. Toggle "Show Filters" on mobile, verify filter panel appears
4. Select a brand from the dropdown → URL updates with `?brand=...` and results filter
5. Click a size button → URL includes `?size=...` and results filter
6. Enter a price range → results filter
7. Click active filter pill's `×` button → filter is removed
8. Click pagination buttons → page changes, URL updates

## 2. View Product & Add to Cart

1. Click any product → navigates to `/products/[id]`
2. Verify product images load, thumbnails work (click to swap main image)
3. Click an available size → size button becomes highlighted, stock text shows
4. Click "Add to Cart" → cart drawer slides from the right with the item
5. Verify cart badge shows item count (1)
6. Close drawer by clicking the backdrop or X button

## 3. Continue Browsing & Add More

1. Navigate back to products
2. Add another product with a different size
3. Verify cart badge shows updated count
4. Open cart drawer → verify both items shown with correct sizes, quantities, and prices

## 4. Checkout → Redirect to Login

1. In cart drawer, click "Checkout"
2. If not logged in, you will be redirected to `/login?callbackUrl=/checkout`
3. Verify login form has email and password fields

## 5. Register New Account

1. Click "Register" link
2. Fill in a fake email and password (min 8 characters)
3. Submit registration → automatically signed in, redirected to checkout
4. If already on login page, enter credentials and sign in

## 6. Complete Checkout

1. On checkout page, verify cart items are displayed with correct totals
2. Fill in shipping address (any dummy values)
3. Verify test card info is displayed: `4242 4242 4242 4242`
4. Click "Pay with Card" → redirected to Stripe Checkout
5. Enter:
   - Card number: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any name and billing address
6. Click "Pay" → redirected back to `/success?session_id=...`

## 7. View Order Confirmation

1. On success page, verify green checkmark and "Order Confirmed!" heading
2. Verify items and totals are shown correctly
3. Note the Order ID

## 8. View Order in My Account

1. Click "Continue Shopping" or navigate to `/account`
2. Verify the order is listed with correct date, total, and status
3. Click the order → navigates to order detail page
4. Verify item details, shipping address, and total are displayed

## 9. Admin Flow

1. Log out via "Sign Out" in navbar
2. Log in as admin: `admin@example.com` / `password123`
3. Verify "Admin" link appears in navbar
4. Click "Admin" → admin dashboard with product/order counts
5. Click "View Orders" → see all customer orders, filter by status
6. Click an order → see full order details (items, shipping, total)
7. Navigate back to admin dashboard → "Manage Products"
8. Verify product list shows all products with edit/delete buttons
9. Click "Add Product" → fill in name, description, brand, price, image URLs, and variants
10. Submit → product appears in list
11. Click "Edit" on a product → pre-filled form, change a field, submit → updates
12. Click "Delete" on a product → confirm dialog → product removed from list

## 10. AI Chat

1. Click the chat bubble in the bottom-right corner
2. Chat window opens with suggested prompts
3. Ask: "What sizes do you have for Nike?" → AI responds with available sizes
4. Ask: "Show me sneakers under ₱5000" → AI lists matching products
5. Close and reopen chat → history is preserved
6. Refresh page → chat history persists from localStorage
