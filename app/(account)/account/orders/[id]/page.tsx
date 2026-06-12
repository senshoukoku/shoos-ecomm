"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

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
  items: OrderItem[]
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/account/orders/${params.id}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json()
          throw new Error(body.error || "Failed to load order")
        }
        return res.json()
      })
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <div className="p-12 text-center"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" /></div>
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="font-body text-red-400 mb-4">{error}</p>
        <Link
          href="/account"
          className="font-heading text-xs tracking-wider text-accent hover:text-accent-light transition-colors"
        >
          &larr; BACK TO MY ORDERS
        </Link>
      </div>
    )
  }

  if (!order) return null

  let shipping: ShippingAddress | null = null
  try {
    shipping = JSON.parse(order.shippingAddress)
  } catch {
  }

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 font-heading text-xs tracking-wider text-ink-muted hover:text-accent transition-colors mb-8 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        BACK TO MY ORDERS
      </Link>

      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-heading text-3xl text-ink">
            Order {order.id.slice(0, 8)}...
          </h1>
          <p className="mt-1.5 font-body text-sm text-ink-dim">
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 font-heading text-xs tracking-wider ${statusColor(order.status)}`}
        >
          {order.status}
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
            {order.items.map((item) => (
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
        {shipping && (
          <div>
            <h2 className="font-heading text-xs tracking-[0.2em] text-ink-muted mb-3">SHIPPING ADDRESS</h2>
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5 font-body text-sm text-ink leading-relaxed">
              <p className="font-medium">{shipping.fullName}</p>
              <p className="text-ink-muted">{shipping.address}</p>
              <p className="text-ink-muted">{shipping.city}, {shipping.zipCode}</p>
              <p className="text-ink-muted">{shipping.country}</p>
            </div>
          </div>
        )}

        <div>
          <h2 className="font-heading text-xs tracking-[0.2em] text-ink-muted mb-3">ORDER SUMMARY</h2>
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5">
            <div className="flex justify-between font-heading text-lg tracking-wide">
              <span className="text-ink-muted">Total</span>
              <span className="text-ink">₱{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
