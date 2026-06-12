# Phase 12 — Git Push

## Goal
Initialize git repository, configure .gitignore, commit all work, and push to remote.

## Steps

### 12.1 Finalize .gitignore
Write `.gitignore` at project root:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/migrations/
```

### 12.2 Initialize Git
```powershell
git init
git add .
git status   # verify only intended files staged
git commit -m "feat: initial full-stack sneaker store

- Next.js 14 with App Router, TypeScript, Tailwind CSS
- PostgreSQL + Prisma ORM with 5 models
- NextAuth credentials authentication
- Product catalog with filtering and pagination
- AI product assistant chat (Groq API)
- Client-side cart (Zustand + localStorage)
- Stripe Checkout payment integration
- User account with order history
- Admin dashboard with product CRUD + order management
- 12 seeded products with size variants"
```

### 12.3 Add Remote & Push
Ask user for the remote repository URL, then:
```powershell
git remote add origin <user-provided-url>
git push -u origin main
```

## Notes
- `.env.local` should NOT be committed (already in .gitignore)
- `prisma/migrations/` is intentionally gitignored — migrations will be re-run on production
- Ensure no secrets or keys are in committed files

## Verification
- `git log --oneline` shows clean commit
- Remote has all files
- Clone to a fresh directory to verify (optional)

## Estimated Files
- `.gitignore`
