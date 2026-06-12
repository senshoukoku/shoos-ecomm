# UI Critical Fix — Deployment Checklist

Organized by priority. Tackle phases in order.

## Phase Overview

| Phase | File(s) | What | Priority | Est. Time |
|-------|---------|------|----------|-----------|
| [01](01-checkout-price-verification.md) | `app/api/checkout/route.ts` | Server-side price verification | 🔴 HIGH | 15 min |
| [02](02-chat-auth.md) | `app/api/chat/route.ts` | Chat API authentication | 🔴 HIGH | 10 min |
| [03](03-chat-context-caching.md) | `lib/chat-context.ts` | Chat catalog caching | 🟡 MEDIUM | 10 min |
| [04](04-middleware-api-protection.md) | `middleware.ts` | Middleware API route coverage | 🟡 MEDIUM | 10 min |
| [05](05-dead-css-removal.md) | `app/globals.css` | Remove unused `.reveal` CSS | 🔵 LOW | 5 min |
| [06](06-toast-timer-cleanup.md) | `store/toast.ts` | Toast timer cleanup | 🔵 LOW | 5 min |

## After Each Phase

```powershell
npm run build
```

The build should produce:
```
✓ Compiled successfully
```

Only pre-existing `<img>` warnings are acceptable. Any type errors or compilation failures must be fixed before moving to the next phase.

## Deployment Gate

All 🔴 HIGH items must be resolved before deployment.
🟡 MEDIUM items should be resolved.
🔵 LOW items are optional but recommended.
