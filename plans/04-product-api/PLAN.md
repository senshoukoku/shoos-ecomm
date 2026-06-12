# Phase 4 — Product API Routes

## Goal
Public API endpoints for listing and viewing products.

## Steps

### 4.1 GET /api/products
Create `app/api/products/route.ts`:
- Query params: `page` (default 1), `brand`, `size`, `minPrice`, `maxPrice`
- Pagination: 8 products per page
- Filtering:
  - `brand`: `WHERE brand = ?` (case-insensitive)
  - `size`: join ProductVariant, `WHERE size = ?`
  - `minPrice` / `maxPrice`: `WHERE price >= ? AND price <= ?`
- Response shape:
```json
{
  "products": [...],
  "total": number,
  "page": number,
  "totalPages": number
}
```
- Each product includes first image URL and lowest price variant

### 4.2 GET /api/products/[id]
Create `app/api/products/[id]/route.ts`:
- Full product with all variants (size + stock)
- Response shape:
```json
{
  "id": "...",
  "name": "...",
  "description": "...",
  "brand": "...",
  "price": 4500,
  "imageUrls": ["..."],
  "variants": [
    { "id": "...", "size": "42", "stock": 8 }
  ]
}
```
- Return 404 if product not found

## Validation
- Sanitize query params (parseInt for numbers, trim strings)
- Handle edge cases: empty results, invalid page numbers
- All endpoints public (no auth required)

## Estimated Files
- `app/api/products/route.ts`
- `app/api/products/[id]/route.ts`
