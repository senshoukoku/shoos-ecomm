# SHOOOS – Premium Sneakers

A modern full-stack e-commerce sneaker store built as a portfolio project. Browse a curated catalog of sneakers, filter by brand/size/price, add items to a client-side cart, create an account, pay via Stripe test mode, and track your order history. Administrators have a dedicated dashboard to manage products and oversee all orders.

**Live Demo:** [https://ecomm-sneakers.vercel.app](https://ecomm-sneakers.vercel.app)

---

## Tech Stack

| Category       | Technology                                                              |
| -------------- | ----------------------------------------------------------------------- |
| Framework      | Next.js 14 (App Router)                                                 |
| Language       | TypeScript                                                              |
| Styling        | Tailwind CSS 3                                                          |
| Database       | PostgreSQL (Supabase) + Prisma ORM                                      |
| Auth           | NextAuth.js (Credentials provider, bcrypt)                              |
| Payments       | Stripe Checkout Sessions (test mode)                                    |
| AI Chat        | Groq SDK (llama-3.3-70b)                                                |
| State Mgmt     | Zustand                                                                 |
| UI Components  | Headless UI                                                             |
| Deployment     | Vercel                                                                  |

---

## Features

- **Product Catalog** – Grid display with pagination, filtering by brand, size, and price range
- **Product Detail** – Image gallery, size selector, stock indicators
- **Cart Management** – Client-side localStorage cart with a slide-out drawer (quantity adjust, remove)
- **Authentication** – Register and login with email/password (credentials)
- **Checkout & Payment** – Stripe Checkout integration (test card `4242 4242 4242 4242`)
- **Order History** – Personal order list with detail view
- **Admin Dashboard** – CRUD products, view all orders, filter by status
- **AI Chat Assistant** – Floating chat bubble that answers product questions via Groq
- **Responsive Design** – Mobile-first with collapsible filters and hamburger navigation

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or Supabase)
- Stripe account (test mode)
- Groq API key

### Environment Variables

Create `.env.local` in the project root:

| Variable                              | Description                          |
| ------------------------------------- | ------------------------------------ |
| `DATABASE_URL`                        | PostgreSQL connection string         |
| `NEXTAUTH_SECRET`                     | Random secret for NextAuth sessions  |
| `NEXTAUTH_URL`                        | App URL (http://localhost:3000)      |
| `STRIPE_SECRET_KEY`                   | Stripe secret key (sk_test_...)      |
| `STRIPE_WEBHOOK_SECRET`               | Stripe webhook signing secret        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  | Stripe publishable key (pk_test_...) |
| `GROQ_API_KEY`                        | Groq API key                         |

### Install & Run

```bash
git clone https://github.com/senshoukoku/shoos-ecomm.git
cd shoos-ecomm

npm install

# Set up environment variables in .env.local (see table above)

npx prisma migrate dev
npx prisma db seed

npm run dev
```

The app will be available at `http://localhost:3000`.

### Seed Data

The seed script creates:
- **12 sneaker products** from brands like Nike, Adidas, New Balance, ASICS, Converse, Vans, Puma, Reebok, and Saucony
- **Admin account**: `admin@example.com` / `password123`

---

## Architecture Notes

- **Cart**: Entirely client-side via Zustand + localStorage. Cart state is lost when the browser is closed. No server-side cart persistence.
- **Checkout Flow**: Cart items + shipping address are sent to `/api/checkout`, which creates a Stripe Checkout Session and returns the redirect URL. A webhook (`/api/webhooks/stripe`) listens for `checkout.session.completed` to finalize the order and decrement stock.
- **AI Chat**: The chat bubble sends a POST to `/api/chat` which streams responses from Groq's llama-3.3-70b model. The system prompt includes the full product catalog so the assistant can answer product-specific questions.
- **Auth**: NextAuth.js with a credentials provider. Session is checked server-side in API routes via `getServerSession`. Protected pages use middleware + client-side guards.
- **API routes** consistently return `{ error: string }` on failure.

---

## Default Accounts

| Role  | Email                  | Password    |
| ----- | ---------------------- | ----------- |
| Admin | admin@example.com      | password123 |
| User  | (any registered email) | (user-set)  |

---

## License

MIT
