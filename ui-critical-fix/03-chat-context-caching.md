# Phase 3: Chat Context Caching

**Priority:** 🟡 MEDIUM
**File:** `lib/chat-context.ts`
**Risk:** Every chat message triggers a full DB scan of all products + variants.

## Problem
`buildSystemPrompt()` calls `prisma.product.findMany({ include: { variants: true } })` on every invocation with zero caching.

## Fix
Add a TTL-based in-memory cache so the catalog is fetched at most once every 60 seconds.

## Steps
1. Read `lib/chat-context.ts`
2. Add a module-level cache:
   ```ts
   let cachedCatalog: Product[] | null = null
   let lastFetch = 0
   const CACHE_TTL = 60_000 // 1 minute
   ```
3. In `buildSystemPrompt`, check cache before querying
4. Build and verify

## Verification
- First chat message → hits DB
- Second chat message within 60s → uses cache
- After 60s → hits DB again

## Optional Enhancement
Use `React.cache()` from React 19 for request-level deduplication as an additional layer.
