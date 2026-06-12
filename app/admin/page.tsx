"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminGuard from "@/components/admin/AdminGuard"

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
      fetch("/api/admin/orders?status=pending").then((r) => r.json()),
    ]).then(([productsRes, ordersRes, pendingRes]) => {
      if (cancelled) return
      if (productsRes.products) setProductCount(productsRes.products.length)
      if (ordersRes.orders) setOrderCount(ordersRes.orders.length)
      if (pendingRes.orders) setPendingCount(pendingRes.orders.length)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  return (
    <AdminGuard>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-4 animate-fade-up">
          <p className="font-heading text-xs tracking-[0.25em] text-accent">ADMIN</p>
          <h1 className="mt-2 font-heading text-4xl text-ink">Dashboard</h1>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 animate-fade-up">
            <p className="font-heading text-xs tracking-[0.2em] text-ink-dim">TOTAL PRODUCTS</p>
            <p className="mt-2 font-heading text-4xl tracking-wide text-ink">{productCount}</p>
          </div>
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <p className="font-heading text-xs tracking-[0.2em] text-ink-dim">TOTAL ORDERS</p>
            <p className="mt-2 font-heading text-4xl tracking-wide text-ink">{orderCount}</p>
          </div>
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 animate-fade-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <p className="font-heading text-xs tracking-[0.2em] text-ink-dim">PENDING ORDERS</p>
            <p className="mt-2 font-heading text-4xl tracking-wide text-accent">{pendingCount}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/products"
            className="group rounded-2xl border border-surface-200 bg-surface-50 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.1)]"
          >
            <h2 className="font-heading text-xl tracking-wide text-ink group-hover:text-accent transition-colors">Manage Products</h2>
            <p className="mt-1.5 font-body text-sm text-ink-muted">Create, edit, or delete products</p>
          </Link>
          <Link
            href="/admin/orders"
            className="group rounded-2xl border border-surface-200 bg-surface-50 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.1)]"
          >
            <h2 className="font-heading text-xl tracking-wide text-ink group-hover:text-accent transition-colors">View Orders</h2>
            <p className="mt-1.5 font-body text-sm text-ink-muted">View all customer orders</p>
          </Link>
        </div>
      </div>
    </AdminGuard>
  )
}
