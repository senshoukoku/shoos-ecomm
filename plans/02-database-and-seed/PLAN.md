# Phase 2 — Database Migrations & Seed Data

## Goal
Create the PostgreSQL database tables and populate with 12 sneaker products + admin user.

## Steps

### 2.1 Run Initial Migration
```powershell
npx prisma migrate dev --name init
```

### 2.2 Create Seed Script
Write `prisma/seed.ts` that:
- Creates admin user:
  - email: `admin@example.com`
  - password: `password123` (hashed with bcryptjs)
  - role: `admin`
- Creates 12 sneaker products across brands:
  - Nike (3 products): Air Force 1, Air Max 90, Dunk Low
  - Adidas (3): Ultraboost, Stan Smith, Campus 00s
  - New Balance (2): 550, 990v5
  - Vans (2): Old Skool, Sk8-Hi
  - Converse (2): Chuck Taylor All Star, Chuck 70
- Each product has variants (sizes 39-45 with varying stock 3-15)
- All use picsum.photos URLs for images (3-4 images per product)
- Prices in PHP (range: ₱3,500 - ₱12,000)

### 2.3 Configure Package.json
Add to `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

### 2.4 Run Seed
```powershell
npx prisma db seed
```

## Verification
- `npx prisma studio` to visually inspect all tables
- Admin user exists with hashed password
- 12 products, ~84 variants (7 sizes × 12 products), 0 orders

## Estimated Files
- `prisma/seed.ts`
- `prisma/schema.prisma` (already created, may need refinement)
- `package.json` (add prisma.seed config)
