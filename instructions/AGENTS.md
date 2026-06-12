# AGENTS.md – Strict Instructions for Implementing the Sneaker Store Portfolio

> **Project:** Modern Full‑Stack Sneaker Store (Portfolio E‑Commerce)  
> **Purpose of this file:** Define absolute rules, scope boundaries, tech stack, data models, routes, and forbidden actions. Any agent or developer MUST follow this exactly. No exceptions.

---

## 🎯 Mandate

You are to build a complete, production‑ready portfolio e‑commerce application with the exact features listed in `FUNCTIONS.md`. This document defines the hard constraints under which you must operate. You are **not** allowed to improvise, extend, or reinterpret the requirements. If a feature is not explicitly requested, it must not exist.

---

## 🚫 STRICTLY OUT OF SCOPE

The following are **forbidden** – do not implement them, even if they seem “nice to have”:

- ❌ Social login (Google, GitHub, etc.)
- ❌ Multi‑vendor, reviews, ratings, wishlists
- ❌ Password reset flows (no email sending)
- ❌ Real image uploads (use placeholder URLs only)
- ❌ Product recommendations or related items
- ❌ Cart persistence for guest users across devices (localStorage only, lost on browser close)
- ❌ Internationalization, multi‑language, multi‑currency
- ❌ Caching layers (Redis, etc.)
- ❌ Server‑side cart (cart is client‑side only until checkout)
- ❌ Comments, live notifications
- ❌ Advanced search (full‑text) – only simple `LIKE` filtering allowed
- ❌ Admin analytics, charts, dashboards beyond basic CRUD tables
- ❌ User profile editing, password changes, email verification
- ❌ Email sending of any kind (order confirmations, etc.) – only Stripe handles its own emails in test mode
- ❌ Any form of SSR/ISR/SSG for cart data – cart is purely client‑side until checkout

---

## 🧱 FROZEN TECH STACK

You must use these technologies in this exact configuration:

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API routes (no separate Express server)
- **Database:** PostgreSQL (hosted on Supabase) with Prisma ORM
- **Authentication:** NextAuth.js with **Credentials provider only** (email + password)
- **Payments:** Stripe (test mode), using Stripe Checkout Sessions
- **Images:** External URLs only (use `https://picsum.photos/id/...`)
- **Deployment:** Vercel
- **UI:** Tailwind only. You may use Headless UI for cart drawer and modal(s), but no other component libraries.
- **AI Chat:** Groq API (`groq-sdk`) + llama-3.3-70b model

---

## 📦 Database Models (Prisma – Exact Schema)

The following models are the **only** entities allowed. Do not add fields or tables.

model User {
id String @id @default(uuid())
email String @unique
password String
role String @default("user") // "user" or "admin"
orders Order[]
}

model Product {
id String @id @default(uuid())
name String
description String
brand String
price Decimal
imageUrls String[] // stored as JSON array
variants ProductVariant[]
}

model ProductVariant {
id String @id @default(uuid())
size String // e.g. "40", "41"
stock Int
productId String
product Product @relation(fields: [productId], references: [id])
}

model Order {
id String @id @default(uuid())
userId String
user User @relation(fields: [userId], references: [id])
status String @default("paid") // paid, shipped, delivered
total Decimal
shippingAddress Json
createdAt DateTime @default(now())
items OrderItem[]
}

model OrderItem {
id String @id @default(uuid())
orderId String
order Order @relation(fields: [orderId], references: [id])
productId String
productName String
size String
quantity Int
price Decimal // snapshot of price at purchase time
}


---

## 🌐 API Routes (Complete List – No Additions)

| Method | Endpoint                        | Purpose                                      | Protection |
|--------|---------------------------------|----------------------------------------------|------------|
| GET    | `/api/products`                 | List products (page, brand, size, minPrice, maxPrice) | Public     |
| GET    | `/api/products/[id]`            | Single product with variants                | Public     |
| POST   | `/api/admin/products`           | Create a product                            | Admin only |
| PUT    | `/api/admin/products/[id]`      | Update a product                            | Admin only |
| DELETE | `/api/admin/products/[id]`      | Delete a product                            | Admin only |
| GET    | `/api/admin/orders`             | List all orders (filter by status optional)  | Admin only |
| POST   | `/api/auth/[...nextauth]`       | NextAuth handler (credentials)               | Public     |
| POST   | `/api/checkout`                 | Create Stripe Checkout Session               | Auth required |
| POST   | `/api/webhooks/stripe`          | Stripe webhook (must accept raw body)        | Public (verify sig) |
| GET    | `/api/account/orders`           | Current user’s orders                        | Auth required |
| GET    | `/api/account/orders/[id]`      | Single order detail (owner check)            | Auth required |

| POST   | `/api/chat`                   | AI product assistant chat (streaming)       | Public     |

No other API endpoints are allowed.

---

## 🖥️ Frontend Pages (Exhaustive List)

- `/` – Home page with hero banner and 4 featured products
- `/products` – Catalog with pagination and filters
- `/products/[id]` – Product detail
- `/login` – Login form
- `/register` – Register form
- `/checkout` – Checkout page (protected)
- `/success` – Order success page (after Stripe redirect)
- `/account` – User’s order list (protected)
- `/account/orders/[id]` – Order detail (protected)
- `/admin` – Admin dashboard (product list, orders list) – admin only
- `/admin/products/new` – Create product form – admin only
- `/admin/products/[id]/edit` – Edit product form – admin only

**No other pages.** No about, contact, cart page (cart is a drawer), or user settings.

---

## ⚠️ STRICT DEVELOPMENT RULES

1. **No scope creep.** Implement exactly what is in `FUNCTIONS.md` and nothing more.
2. **Packages:** Only use packages explicitly required by the tech stack (next, react, tailwindcss, prisma, next-auth, stripe, headlessui/react, etc.). Do not add utility libraries unless they are unavoidable and you justify it in a comment.
3. **Styling:** Pure Tailwind classes. No custom CSS files (except global styles for resets if needed). Minimal animations – subtle hover/opacity transitions only.
4. **Images:** Never use local images or uploads. All product images must be external URLs (picsum). Seed the database with 12 products that look realistic (brand names like “Nike”, “Adidas” are okay for portfolio purposes).
5. **Security:**
   - Hash passwords with bcrypt (use `bcryptjs`).
   - All admin endpoints must verify `role === "admin"` from the authenticated session.
   - Order retrieval must check that the order belongs to the requesting user.
6. **Performance:** Keep it simple. No static generation or incremental regeneration for dynamic routes; just use client‑side data fetching and API calls. Cart state is managed client‑side (Zustand or React Context).
7. **Testing:** You must manually verify the full flow: register → browse → filter → add to cart → login → checkout (using test card `4242 4242 4242 4242`) → see order in account and admin. Document the steps in a `TESTING.md` file.
8. **Documentation:** Write a complete `README.md` with setup instructions, environment variables, and architecture decisions. Include the live demo URL.
9. **Do not over‑engineer.** If a simple `useState` works, use it. Don’t create unnecessary custom hooks, utilities, or abstraction layers.
10. **Error handling:** Provide basic try/catch and user‑friendly error states (toast or inline messages). No logging service.
11. **Code organization:** Organize by feature/domain, not by file type. Keep it clean and easily readable.

---

## 🚀 Success Criteria for Completion

- The app is live on a public URL (Vercel).
- A recruiter can complete the entire flow without errors.
- Admin can manage products and view orders.
- The codebase is strictly typed, well‑structured, and free of any out‑of‑scope features.
- All strict rules in this document are satisfied.

---

**The implementing agent must treat this document as a binding specification. Do not deviate.**