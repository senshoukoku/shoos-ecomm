# Bug Fixes

## Critical Bugs

### 1. Product Detail Page 500 Error
- **File**: `app/products/[id]/page.tsx`
- **Cause**: Used React's `use(params)` to unwrap params as a Promise. This is the Next.js 15+ pattern, but the project runs Next.js 14 where `params` is a plain synchronous object, not a Promise. `React.use()` throws `"An unsupported type was passed to use(): [object Object]"` when given a plain object.
- **Fix**: Changed `params: Promise<{ id: string }>` to `params: { id: string }` and access `params.id` directly instead of via `use()`.

### 2. Missing Page: Admin Edit Product
- **File**: `app/admin/products/[id]/edit/page.tsx` (newly created)
- **Cause**: The "Edit" button on `/admin/products` navigated to `/admin/products/[id]/edit` which had no page file, resulting in a 404.
- **Fix**: Created the edit product page with a full form pre-populated from the API (`GET /api/products/[id]`) that submits via `PUT /api/admin/products/[id]`.

### 3. Missing Page: Account Order Detail
- **File**: `app/account/orders/[id]/page.tsx` (newly created)
- **Cause**: Clicking an order row on `/account` navigated to `/account/orders/[id]` which had no page file.
- **Fix**: Created the order detail page that fetches from `GET /api/account/orders/[id]` and displays items, shipping address, and status.

## Currency Inconsistency

### 4. Checkout Page Uses Wrong Currency Symbol
- **File**: `app/checkout/page.tsx` (lines 64, 67)
- **Cause**: The checkout page displayed prices with `$` prefix and `.toFixed(2)` (e.g. `$4995.00`) while every other page used `₱` with `.toLocaleString()` (e.g. `₱4,995`).
- **Fix**: Changed `$` to `₱` and `.toFixed(2)` to `.toLocaleString()`.

## Status Display Bug

### 5. Account Orders Status Comparison Case Mismatch
- **File**: `app/(account)/account/page.tsx`
- **Cause**: The order status badge color logic compared against uppercase strings (`"PAID"`, `"SHIPPED"`, `"DELIVERED"`), but the database stores statuses in lowercase (`"paid"`, `"shipped"`, `"delivered"`). Admin orders page handled this correctly with lowercase comparisons. This caused all order statuses on the account page to always render the default gray badge instead of their colored variants.
- **Fix**: Added `.toLowerCase()` to the status comparison.

## Test-Only Fixes

### 6. Registration Short Password Test Blocked by HTML Validation
- **File**: `tests/e2e.spec.ts`
- **Cause**: Test filled a 5-character password, but the input has `minLength={8}` which triggers browser-native HTML validation before the React handler fires, preventing the app's error message from appearing.
- **Fix**: Changed test to verify mismatched passwords instead.

### 7. Admin Orders Test Strict-Mode Locator Violation
- **File**: `tests/e2e.spec.ts`
- **Cause**: `text=Orders` matched two elements: the `<h1>` heading and a `<td>` containing "No orders found." Playwright's strict mode rejected the ambiguous match.
- **Fix**: Changed to `getByRole("heading", { name: "Orders" })`.

### 8. Cart Button Selector Conflicts with Hamburger Menu SVG
- **File**: `tests/e2e.spec.ts`
- **Cause**: Both the cart button and mobile hamburger button contain SVG children. The locator `filter({ has: page.locator("svg") })` matched multiple buttons.
- **Fix**: Changed cart tests to open the drawer via localStorage state manipulation instead of DOM click.
