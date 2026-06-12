"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ProductGrid from "@/components/product/ProductGrid"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string | null
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/products?page=1&limit=4")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setFeatured(data.products ?? []) })
      .catch(() => { if (!cancelled) setFeatured([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-50 to-surface" />
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(circle at 20% 50%, rgba(245,158,11,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(251,191,36,0.1) 0%, transparent 50%)"
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div data-animate className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="font-heading text-sm tracking-[0.3em] text-accent">PREMIUM SNEAKERS</p>
          <h1 className="mt-6 font-heading text-7xl sm:text-8xl lg:text-9xl leading-none text-ink">
            STEP INTO
            <br />
            <span className="text-gradient">STYLE</span>
          </h1>
          <p className="mt-6 font-body text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
            Discover the freshest kicks from the biggest brands. Your next pair is one click away.
          </p>
          <div className="mt-10">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-10 py-4 font-heading text-sm tracking-widest text-surface hover:bg-accent-dark transition-all duration-300 hover:scale-105"
            >
              SHOP NOW
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section data-animate className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div           className="flex items-end justify-between mb-12">
          <div>
            <p className="font-heading text-xs tracking-[0.25em] text-accent">COLLECTION</p>
            <h2 className="mt-2 font-heading text-4xl sm:text-5xl text-ink">Featured Products</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 font-heading text-sm tracking-wider text-ink-muted hover:text-accent transition-colors duration-300 group"
          >
            VIEW ALL
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-surface-50 border border-surface-200">
                <div className="aspect-square rounded-t-xl bg-surface-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-16 rounded bg-surface-100" />
                  <div className="h-4 w-32 rounded bg-surface-100" />
                  <div className="h-4 w-20 rounded bg-surface-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={featured} />
        )}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-heading text-sm tracking-wider text-ink-muted hover:text-accent transition-colors"
          >
            VIEW ALL
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
