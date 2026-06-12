# Phase 7 — Client-Side Cart

## Goal
Shopping cart managed entirely client-side with Zustand + localStorage, accessible via slide-out drawer.

## Steps

### 7.1 Cart Store
Create `store/cart.ts` (Zustand with persist middleware):
```ts
interface CartItem {
  id: string  // unique key = `${productId}-${size}`
  productId: string
  productName: string
  brand: string
  price: number
  size: string
  quantity: number
  imageUrl: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}
```
- `addItem`: if same productId + size exists, increment quantity; otherwise add new
- `updateQuantity`: remove item if quantity reaches 0
- Persist to localStorage key: `sneaker-cart`

### 7.2 Cart Drawer Component
Create `components/cart/CartDrawer.tsx` using `@headlessui/react` `Dialog`:
- Slide-out from right (`transition` with `enterFrom="translate-x-full"`)
- Overlay behind drawer
- Content:
  - Header: "Shopping Cart" + close button
  - Item list (or "Your cart is empty" state):
    - Each item: thumbnail, name, brand, size, quantity adjuster (±), unit price, line total, remove button
  - Footer:
    - Subtotal (calculated from store)
    - "Checkout" button → navigates to `/checkout`
    - Continue Shopping button → closes drawer
- Max height with scroll if many items

### 7.3 Cart Icon / Badge
In `components/Navbar.tsx`:
- Cart icon (SVG) with badge showing `totalItems`
- Badge: red circle with white number, hidden when 0
- Click → opens CartDrawer

### 7.4 Wire Up Product Detail "Add to Cart"
In `app/products/[id]/page.tsx`:
- "Add to Cart" button calls `cartStore.addItem()` with selected size
- After adding: open cart drawer automatically
- Disabled if no size selected or size out of stock

## Estimated Files
- `store/cart.ts`
- `components/cart/CartDrawer.tsx`
- `components/Navbar.tsx` (add cart button + badge)
- `app/products/[id]/page.tsx` (wire up add to cart)
