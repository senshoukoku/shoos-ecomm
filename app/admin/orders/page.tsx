"use client"

import { useEffect, useState } from "react"
import AdminGuard from "@/components/admin/AdminGuard"

type OrderItem = {
  id: string
  productName: string
  size: string
  quantity: number
  price: number
}

type ShippingAddress = {
  fullName: string
  address: string
  city: string
  zipCode: string
  country: string
}

type Order = {
  id: string
  createdAt: string
  status: string
  total: number
  shippingAddress: string
  user: { email: string }
  items: OrderItem[]
}

const STATUSES = ["", "paid", "shipped", "delivered"]

function statusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-900/40 text-green-400 border border-green-700/30"
    case "shipped":
      return "bg-amber-900/40 text-amber-400 border border-amber-700/30"
    case "delivered":
      return "bg-blue-900/40 text-blue-400 border border-blue-700/30"
    default:
      return "bg-surface-100 text-ink-dim border border-surface-200"
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : "/api/admin/orders"
    fetch(url)
      .then((res) => res.json())
      .then((data) => { if (!cancelled && data.orders) setOrders(data.orders) })
      .catch(() => { if (!cancelled) setOrders([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [statusFilter])

  function parseShipping(raw: string): ShippingAddress | null {
    try { return JSON.parse(raw) } catch { return null }
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-heading text-4xl text-ink">Orders</h1>

        {selectedOrder ? (
          <div>
            <button onClick={() => setSelectedOrder(null)}
              className="mt-6 inline-flex items-center gap-2 font-heading text-xs tracking-wider text-ink-muted hover:text-accent transition-colors group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              BACK TO ORDERS
            </button>

            <div className="mt-8 flex items-start justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl text-ink">Order {selectedOrder.id.slice(0, 8)}...</h2>
                <p className="mt-1.5 font-body text-sm text-ink-dim">
                  {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p className="font-body text-sm text-ink-dim">{selectedOrder.user.email}</p>
              </div>
              <span className={`rounded-full px-4 py-1.5 font-heading text-xs tracking-wider ${statusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="mb-10 overflow-x-auto rounded-2xl border border-surface-200">
              <table className="w-full text-left font-body text-sm">
                <thead className="border-b border-surface-200 bg-surface-50 text-ink-muted">
                  <tr>
                    <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">PRODUCT</th>
                    <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">SIZE</th>
                    <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">QTY</th>
                    <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">PRICE</th>
                    <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id} className="text-ink">
                      <td className="px-5 py-4">{item.productName}</td>
                      <td className="px-5 py-4">{item.size}</td>
                      <td className="px-5 py-4">{item.quantity}</td>
                      <td className="px-5 py-4">₱{item.price.toLocaleString()}</td>
                      <td className="px-5 py-4 font-heading tracking-wide">₱{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {(() => {
                const shipping = parseShipping(selectedOrder.shippingAddress)
                return shipping ? (
                  <div>
                    <h3 className="font-heading text-xs tracking-[0.2em] text-ink-muted mb-3">SHIPPING ADDRESS</h3>
                    <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5 font-body text-sm text-ink leading-relaxed">
                      <p className="font-medium">{shipping.fullName}</p>
                      <p className="text-ink-muted">{shipping.address}</p>
                      <p className="text-ink-muted">{shipping.city}, {shipping.zipCode}</p>
                      <p className="text-ink-muted">{shipping.country}</p>
                    </div>
                  </div>
                ) : null
              })()}

              <div>
                <h3 className="font-heading text-xs tracking-[0.2em] text-ink-muted mb-3">ORDER SUMMARY</h3>
                <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5">
                  <div className="flex justify-between font-heading text-lg tracking-wide">
                    <span className="text-ink-muted">Total</span>
                    <span className="text-ink">₱{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-4 py-2 font-heading text-xs tracking-wider transition-all duration-200 ${
                    statusFilter === s
                      ? "bg-accent text-surface"
                      : "bg-surface-50 text-ink-muted hover:text-ink border border-surface-200"
                  }`}
                >
                  {s === "" ? "ALL" : s.toUpperCase()}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="mt-8 text-center"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" /></div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-surface-200">
                <table className="w-full text-left font-body text-sm">
                  <thead className="border-b border-surface-200 bg-surface-50 text-ink-muted">
                    <tr>
                      <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">ORDER ID</th>
                      <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">CUSTOMER</th>
                      <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">DATE</th>
                      <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">TOTAL</th>
                      <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    {orders.map((order) => (
                      <tr key={order.id} onClick={() => setSelectedOrder(order)}
                        className="cursor-pointer text-ink transition-colors hover:bg-surface-50">
                        <td className="px-5 py-4 font-mono text-xs text-ink-dim">{order.id.slice(0, 8)}...</td>
                        <td className="px-5 py-4">{order.user.email}</td>
                        <td className="px-5 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4 font-heading tracking-wide">₱{order.total.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block rounded-full px-3 py-1 font-heading text-xs tracking-wider ${statusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-16 text-center text-ink-muted">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AdminGuard>
  )
}
