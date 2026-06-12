# Phase 1: Server-Side Price Verification in Checkout

**Priority:** 🔴 HIGH
**File:** `app/api/checkout/route.ts`
**Risk:** A malicious user can set `price: 0.01` on any item and checkout for pennies.

## Problem
The checkout route trusts the `price` sent by the client. It only validates stock, but never verifies the actual price from the database before creating the Stripe session.

```ts
// Current (broken) — uses client's price directly:
unit_amount: Math.round(item.price * 100)
```

## Fix
Look up each product's real price from `prisma.product` inside the checkout route and reject if the client's price doesn't match.

## Steps
1. Read `app/api/checkout/route.ts`
2. After the stock check loop (line 29-38), add a price verification loop that fetches each product and compares prices
3. If any price doesn't match, return 400
4. Use the DB price for the order total and Stripe session, not the client's price

## Verification
- Run `npm run build` — should compile with 0 errors
- Test with a modified client price — should get 400 error
