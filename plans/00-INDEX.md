# Sneaker Store Portfolio — Master Implementation Plan

## Source Documents

| File | Purpose |
|---|---|
| `instructions/AGENTS.md` | Technical constraints: stack, schema, routes, forbidden features |
| `instructions/FUNCTIONS.md` | Functional requirements: features, user flows, seed data |

## Overview

Full-stack sneaker e-commerce with Next.js 14 (App Router), TypeScript, Tailwind CSS, PostgreSQL (Supabase), Prisma, NextAuth.js, Stripe, and Groq AI chat.

## Phase Summary

| # | Phase | Est. Files | Depends On |
|---|-------|-----------|------------|
| 1 | Project Scaffolding & Foundation | ~8 | — |
| 2 | Database Migrations & Seed | ~3 | Phase 1 |
| 3 | Authentication (NextAuth) | ~6 | Phase 2 |
| 4 | Product API Routes | ~3 | Phase 2 |
| 5 | Frontend Product Browsing | ~7 | Phase 4 |
| 6 | AI Product Assistant Chat | ~6 | Phase 5 |
| 7 | Client-Side Cart | ~4 | Phase 5 |
| 8 | Checkout & Stripe Payment | ~5 | Phase 3, 7 |
| 9 | Account & Order History | ~5 | Phase 3, 8 |
| 10 | Admin Dashboard | ~8 | Phase 3, 8 |
| 11 | Polish & Documentation | ~3 | Phase 1-10 |
| 12 | Git Push | ~2 | Phase 11 |

## Key Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| State management | Zustand | Lightweight, simpler than Context for cart & chat |
| Cart persistence | localStorage | Client-side only, lost on browser close (per spec) |
| Data fetching | Client-side fetch + SWR pattern | No SSR/ISR for dynamic routes (per spec) |
| Styling | Pure Tailwind + Headless UI | No component libraries (per spec) |
| Images | picsum.photos | External URLs only, no uploads |
| Password hashing | bcryptjs | Per security rule |
| AI Provider | Groq (llama-3.3-70b) | Fast, free tier, OpenAI-compatible |
| Chat persistence | localStorage | Session-only (per user choice) |
