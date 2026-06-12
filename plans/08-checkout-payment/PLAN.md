# Phase 8 — Checkout & Stripe Payment

## Goal
Complete payment flow: checkout page → Stripe Checkout Session → webhook → order creation.

## Steps

### 8.1 Checkout API Endpoint
Create `app/api/checkout/route.ts` (POST, auth required):
- Get current user from session
- Receive: `{ items: CartItem[], shippingAddress: {...} }`
- Validate stock availability for each item's variant
- Create Stripe Checkout Session:
  - Line items from cart (name, quantity, price in cents)
  - `mode: "payment"`
  - `success_url: "/success?session_id={CHECKOUT_SESSION_ID}"`
  - `cancel_url: "/checkout?canceled=true"`
  - `metadata`: userId, shippingAddress (JSON stringified)
- Return `{ url: session.url }` for redirect

### 8.2 Checkout Page
Create `app/checkout/page.tsx` (protected):
- Section 1: Cart Summary
  - Read-only list of cart items with quantities and prices
  - Calculated total
- Section 2: Shipping Address Form
  - Fields: Full Name, Address, City, Zip Code, Country
  - Basic validation (all required)
- Section 3: Payment
  - Informational box: "Test Card: 4242 4242 4242 4242 — any future date, any CVC"
  - "Pay with Card" button
  - On click: POST to `/api/checkout`, then `window.location.href = response.url`

### 8.3 Stripe Webhook
Create `app/api/webhooks/stripe/route.ts` (POST, public but signature-verified):
- Use `stripe.webhooks.constructEvent()` with raw body
- Handle `checkout.session.completed` event:
  - Extract `metadata.userId` and `metadata.shippingAddress`
  - Parse line items from Stripe session
  - Create `Order` record in DB (status: "paid")
  - Create `OrderItem` records for each line
  - Decrement stock for each `ProductVariant`
- Return 200 to Stripe
- Edge cases: duplicate webhook events (idempotency via session ID check)

**IMPORTANT**: This route MUST accept raw request body (not parsed JSON). Configure in Next.js:
```ts
export const config = {
  api: {
    bodyParser: false,
  },
}
```

### 8.4 Success Page
Create `app/success/page.tsx` (protected):
- Read `session_id` from URL query params
- Fetch order details via API or extract from session
- Display:
  - Checkmark / success icon
  - "Order Confirmed!" heading
  - Order ID
  - Item list with quantities and prices
  - Total amount
  - "Continue Shopping" link → `/products`

## Estimated Files
- `app/api/checkout/route.ts`
- `app/checkout/page.tsx`
- `app/api/webhooks/stripe/route.ts`
- `app/success/page.tsx`
