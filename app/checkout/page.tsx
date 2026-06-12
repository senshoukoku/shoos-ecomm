"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  })

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-heading text-4xl text-ink">Your cart is empty</h1>
        <p className="mt-3 font-body text-ink-muted">Add some items to your cart before checking out.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200"
        >
          BROWSE PRODUCTS
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { fullName, address, city, zipCode, country } = shippingAddress
    if (!fullName || !address || !city || !zipCode || !country) {
      setError("Please fill in all shipping address fields.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
          shippingAddress,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        setLoading(false)
        return
      }

      clearCart()
      window.location.href = data.url
    } catch {
      setError("Failed to connect to server.")
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-4xl text-ink">Checkout</h1>

      <section className="mt-10">
        <h2 className="font-heading text-sm tracking-[0.2em] text-ink-muted">CART SUMMARY</h2>
        <div className="mt-4 divide-y divide-surface-200 rounded-2xl border border-surface-200 bg-surface-50">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="h-16 w-16 rounded-xl object-cover bg-surface-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-ink truncate">{item.productName}</p>
                <p className="font-body text-xs text-ink-dim mt-0.5">
                  Size: {item.size} | Qty: {item.quantity}
                </p>
              </div>
              <p className="font-heading text-lg tracking-wide text-ink">₱{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div className="flex justify-between px-5 py-4 font-heading text-xl tracking-wide">
            <span className="text-ink-muted">Total</span>
            <span className="text-ink">₱{totalPrice().toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-sm tracking-[0.2em] text-ink-muted">SHIPPING ADDRESS</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div>
            <label htmlFor="fullName" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
              FULL NAME
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
              className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="address" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
              ADDRESS
            </label>
            <input
              id="address"
              type="text"
              required
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
                CITY
              </label>
              <input
                id="city"
                type="text"
                required
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
                ZIP CODE
              </label>
              <input
                id="zipCode"
                type="text"
                required
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="country" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
              COUNTRY
            </label>
            <input
              id="country"
              type="text"
              required
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <p className="font-body text-sm text-accent-light">
              <span className="font-heading tracking-wider">TEST CARD:</span> 4242 4242 4242 4242 — any future date, any CVC
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-6 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "PAY WITH CARD"}
          </button>
        </form>
      </section>
    </div>
  )
}
