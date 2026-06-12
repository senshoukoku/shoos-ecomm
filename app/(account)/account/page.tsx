"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type OrderSummary = {
  id: string
  createdAt: string
  total: number
  status: string
  itemCount: number
}

export default function AccountPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    fetch("/api/account/orders")
      .then((res) => res.json())
      .then((data) => { if (!cancelled && data.orders) setOrders(data.orders) })
      .catch(() => { if (!cancelled) setOrders([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return <div className="p-12 text-center"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" /></div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-heading text-4xl text-ink">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-surface-200 p-16 text-center">
          <p className="font-body text-ink-muted mb-6">No orders yet</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all"
          >
            BROWSE PRODUCTS
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-surface-200">
          <table className="w-full text-left font-body text-sm">
            <thead className="border-b border-surface-200 bg-surface-50 text-ink-muted">
              <tr>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">ORDER ID</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">DATE</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">ITEMS</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">TOTAL</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => router.push(`/account/orders/${order.id}`)}
                  className="cursor-pointer text-ink transition-colors hover:bg-surface-50"
                >
                  <td className="px-5 py-4 font-mono text-xs text-ink-dim">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-4 text-ink">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">{order.itemCount}</td>
                  <td className="px-5 py-4 font-heading tracking-wide">₱{order.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 font-heading text-xs tracking-wider ${
                        order.status.toLowerCase() === "paid"
                          ? "bg-green-900/40 text-green-400 border border-green-700/30"
                          : order.status.toLowerCase() === "delivered"
                            ? "bg-blue-900/40 text-blue-400 border border-blue-700/30"
                            : order.status.toLowerCase() === "shipped"
                              ? "bg-amber-900/40 text-amber-400 border border-amber-700/30"
                              : "bg-surface-100 text-ink-dim border border-surface-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
