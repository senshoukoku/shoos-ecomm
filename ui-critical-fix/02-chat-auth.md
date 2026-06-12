# Phase 2: Chat API Authentication

**Priority:** 🔴 HIGH
**File:** `app/api/chat/route.ts`
**Risk:** Anyone can consume your Groq API credits. No rate limiting either.

## Problem
The chat endpoint has zero authentication. A scraper can call it indefinitely.

## Fix
Add `getServerSession(authOptions)` check at the top of the `POST` handler.

## Steps
1. Read `app/api/chat/route.ts`
2. Import `getServerSession` and `authOptions`
3. Add session check at the start of `POST`:
   ```ts
   const session = await getServerSession(authOptions)
   if (!session?.user?.id) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
   }
   ```
4. Build and verify

## Verification
- Request without auth cookie → 401
- Request with valid session → works as before
