# Phase 3 — Authentication (NextAuth)

## Goal
Full auth system with email/password login, registration, session handling, and route protection.

## Steps

### 3.1 NextAuth Configuration
Create `lib/auth.ts`:
- NextAuth config with Credentials provider
- `authorize()`: find user by email, compare bcrypt hash
- JWT strategy (no database sessions)
- Callbacks:
  - `jwt`: embed user id + role into token
  - `session`: expose id + role on session.user

### 3.2 NextAuth API Route
Create `app/api/auth/[...nextauth]/route.ts`:
- Export `GET` and `POST` handlers from NextAuth config

### 3.3 Auth Middleware
Create `middleware.ts` at root:
- Protect routes: `/checkout`, `/account`, `/account/*`, `/admin`, `/admin/*`
- Redirect unauthenticated users to `/login`
- Redirect non-admin users away from `/admin/*`

### 3.4 Login Page
Create `app/(auth)/login/page.tsx`:
- Email + password form
- Error state for invalid credentials
- Redirect to checkout (or home) on success
- Link to register page

### 3.5 Register Page
Create `app/(auth)/register/page.tsx`:
- Email + password + confirm password form
- Validation: min 8 chars, passwords match
- Hash password with bcryptjs, create user in DB
- Auto-login after register (or redirect to login)
- Link to login page

### 3.6 Auth Utilities
Create `lib/auth-helpers.ts`:
- `getServerSession` wrapper for API routes
- Helper to check admin role

## Route Protection Logic
| Route | Guard | Behavior |
|---|---|---|
| `/checkout` | Auth required | Redirect → `/login?callbackUrl=/checkout` |
| `/account/*` | Auth required | Redirect → `/login?callbackUrl=/account` |
| `/admin/*` | Admin required | Redirect → `/login` or 403 |

## Estimated Files
- `lib/auth.ts`
- `lib/auth-helpers.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `middleware.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
