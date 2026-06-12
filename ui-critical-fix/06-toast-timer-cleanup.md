# Phase 6: Toast Timer Cleanup

**Priority:** 🔵 LOW
**File:** `store/toast.ts`
**Risk:** Minor — `setTimeout` fires after manual dismiss (already guarded by stale-ID check).

## Problem
When a toast is manually dismissed via `removeToast`, the `setTimeout` from `addToast` still fires after 4 seconds. Currently guarded by a stale-ID check (`current.some(t => t.id === id)`), but the timer itself is never cleared.

## Fix
Track timer IDs and clear them on manual dismiss.

## Steps
1. Read `store/toast.ts`
2. Add a `Set<string>` or `Map<string, NodeJS.Timeout>` to track active timer IDs
3. In `addToast`, store the timer reference
4. In `removeToast`, clear the timer before removing
5. Build and verify

## Note
This is a minor memory/lifetime hygiene fix. The existing stale-ID guard already prevents any functional bug. Only worth doing if you're also adding other store improvements.
