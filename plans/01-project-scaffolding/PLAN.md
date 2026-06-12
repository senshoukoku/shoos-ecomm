# Phase 1 — Project Scaffolding & Foundation

## Goal
Initialize a Next.js 14 project with all dependencies, Prisma schema, environment variables, and folder structure.

## Steps

### 1.1 Create Next.js App
```powershell
npx create-next-app@14 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

### 1.2 Install Dependencies
```powershell
npm install prisma @prisma/client next-auth@4 bcryptjs stripe @headlessui/react zustand groq-sdk
npm install -D @types/bcryptjs tsx
```

### 1.3 Prisma Schema
Write `prisma/schema.prisma` with exact 5 models from AGENTS.md:
- User (id, email, password, role, orders)
- Product (id, name, description, brand, price, imageUrls, variants)
- ProductVariant (id, size, stock, productId, product)
- Order (id, userId, user, status, total, shippingAddress, createdAt, items)
- OrderItem (id, orderId, order, productId, productName, size, quantity, price)

### 1.4 Prisma Client Singleton
Create `lib/prisma.ts` — global singleton pattern (prevent multiple instances in dev hot reload).

### 1.5 Environment Variables
Create `.env.local` with:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generated>
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
GROQ_API_KEY=gsk_...
```

### 1.6 Folder Structure
```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (account)/
│   │   ├── account/
│   │   └── account/orders/[id]
│   ├── admin/
│   │   ├── products/new
│   │   └── products/[id]/edit
│   ├── products/[id]
│   ├── checkout/
│   ├── success/
│   ├── api/
│   │   ├── auth/[...nextauth]
│   │   ├── products/
│   │   ├── checkout/
│   │   ├── webhooks/stripe
│   │   ├── chat/
│   │   └── account/orders/
│   └── layout.tsx
├── components/
│   ├── chat/
│   ├── cart/
│   ├── product/
│   └── ui/
├── lib/
│   ├── prisma.ts
│   └── auth.ts
├── store/
│   ├── cart.ts
│   └── chat.ts
└── prisma/
    └── schema.prisma
```

### 1.7 Git Init (partial)
```powershell
git init
```
(.gitignore will be finalized in Phase 12)

## Estimated Files
- `prisma/schema.prisma`
- `lib/prisma.ts`
- `.env.local` (template)
- `.gitignore`
- `package.json` (auto-updated)
- `tsconfig.json` (auto-configured)
- `tailwind.config.ts` (auto-configured)
- `next.config.mjs` (minimal)
