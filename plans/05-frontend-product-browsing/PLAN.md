# Phase 5 — Frontend Product Browsing

## Goal
All public-facing product pages: home, catalog, product detail, and the global layout.

## Steps

### 5.1 Root Layout & Navbar
Create `app/layout.tsx` (global):
- HTML wrapper with Tailwind styles
- Navbar component at top
- CartDrawer component (rendered but hidden)
- ChatBubble component (Phase 6, placeholder for now)
- SessionProvider wrapper for NextAuth

Create `components/Navbar.tsx`:
- Logo/brand link → `/`
- Navigation links: Products → `/products`
- Cart icon (with item count badge, placeholder for Phase 7)
- Conditional links:
  - Guest: Login, Register
  - User: My Account
  - Admin: Admin link (only if role === "admin")
- Mobile hamburger menu

### 5.2 Home Page
Create `app/page.tsx`:
- Hero banner section (full-width, bg gradient or image, tagline)
- "Featured Products" section: 4 hand-picked products in a grid
- Fetch products from `/api/products?page=1&limit=4` on client
- Subtle hover effects on product cards

### 5.3 Product Card Component
Create `components/product/ProductCard.tsx`:
- Thumbnail image
- Product name, brand, price
- Hover: slight scale/opacity transition
- Click → navigate to `/products/[id]`

### 5.4 Catalog Page
Create `app/products/page.tsx`:
- Filter sidebar (or top bar):
  - Brand dropdown (unique brands from products)
  - Size selector (buttons/chips for common sizes 39-45)
  - Price range (min/max inputs)
  - Active filters appear as removable chips
- Filters reflected in URL query string (shareable/bookmarkable)
- Product grid (8 per page)
- Pagination controls (prev/next + page numbers)

### 5.5 Product Detail Page
Create `app/products/[id]/page.tsx`:
- Image gallery:
  - Main large image
  - Thumbnail row below (click to swap)
- Product info:
  - Name, brand, price
  - Description
  - Size selector: buttons for each variant, disabled if stock = 0
  - Stock indicator ("In Stock: X" or "Out of Stock")
- "Add to Cart" button (enabled only when size selected)
  - On click: open cart drawer (Phase 7) or add to store

## Data Fetching Pattern
All pages use client-side `useEffect` + `fetch` or a simple `useSWR`-style pattern:
```tsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch(`/api/products?${params}`)
    .then(r => r.json())
    .then(setData)
    .finally(() => setLoading(false))
}, [params])
```

## Estimated Files
- `app/layout.tsx`
- `components/Navbar.tsx`
- `components/product/ProductCard.tsx`
- `components/product/ProductGrid.tsx`
- `app/page.tsx`
- `app/products/page.tsx`
- `app/products/[id]/page.tsx`
