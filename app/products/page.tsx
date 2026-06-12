"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useScrollReveal } from "@/lib/useScrollReveal"
import ProductGrid from "@/components/product/ProductGrid"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string | null
}

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  )
}

function CatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const brandFilter = searchParams.get("brand") ?? ""
  const sizeFilter = searchParams.get("size") ?? ""
  const minPrice = searchParams.get("minPrice") ?? ""
  const maxPrice = searchParams.get("maxPrice") ?? ""

  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal()

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", page.toString())
    if (brandFilter) params.set("brand", brandFilter)
    if (sizeFilter) params.set("size", sizeFilter)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)

    let cancelled = false
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setData(null) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page, brandFilter, sizeFilter, minPrice, maxPrice])

  useEffect(() => {
    fetch("/api/products?page=1&limit=1000")
      .then((r) => r.json())
      .then((d: ProductsResponse) => {
        const unique = Array.from(
          new Set(d.products.map((p) => p.brand))
        ).sort()
        setBrands(unique)
      })
      .catch(() => {})
  }, [])

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      if (key !== "page") params.set("page", "1")
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  const removeFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)
      params.set("page", "1")
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  const sizes = ["39", "40", "41", "42", "43", "44", "45"]
  const activeFilters: { key: string; label: string }[] = []
  if (brandFilter) activeFilters.push({ key: "brand", label: `Brand: ${brandFilter}` })
  if (sizeFilter) activeFilters.push({ key: "size", label: `Size: ${sizeFilter}` })
  if (minPrice) activeFilters.push({ key: "minPrice", label: `Min: ₱${parseInt(minPrice).toLocaleString()}` })
  if (maxPrice) activeFilters.push({ key: "maxPrice", label: `Max: ₱${parseInt(maxPrice).toLocaleString()}` })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div ref={headerRef} className={`transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <p className="font-heading text-xs tracking-[0.25em] text-accent">CATALOG</p>
        <h1 className="mt-2 font-heading text-5xl text-ink">All Products</h1>
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mt-8 flex items-center gap-2 font-heading text-xs tracking-wider text-ink-muted hover:text-ink transition-colors lg:hidden"
      >
        <FilterIcon />
        {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
      </button>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className={`w-full shrink-0 space-y-8 lg:w-60 lg:block ${showFilters ? "block" : "hidden"}`}>
          <div>
            <label className="font-heading text-xs tracking-[0.2em] text-ink-muted">BRAND</label>
            <select
              value={brandFilter}
              onChange={(e) => setParam("brand", e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-heading text-xs tracking-[0.2em] text-ink-muted">SIZE</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setParam("size", sizeFilter === s ? "" : s)}
                  className={`h-10 w-12 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    sizeFilter === s
                      ? "border-accent bg-accent text-surface"
                      : "border-surface-200 text-ink-muted hover:border-ink-dim hover:text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-heading text-xs tracking-[0.2em] text-ink-muted">PRICE RANGE</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setParam("minPrice", e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              />
              <span className="text-ink-dim">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setParam("maxPrice", e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="font-heading text-xs tracking-[0.15em] text-ink-dim">FILTERS:</span>
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-surface-50 px-3.5 py-1.5 font-body text-xs text-ink-muted"
                >
                  {f.label}
                  <button
                    onClick={() => removeFilter(f.key)}
                    className="text-ink-dim hover:text-ink transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
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
            <>
              <ProductGrid products={data?.products ?? []} />

              {data && data.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setParam("page", String(page - 1))}
                    className="rounded-xl border border-surface-200 px-4 py-2.5 font-heading text-xs tracking-wider text-ink-muted hover:text-ink hover:border-ink-dim transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    PREV
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setParam("page", String(p))}
                          className={`w-10 h-10 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                            p === page
                              ? "bg-accent text-surface"
                              : "text-ink-muted hover:text-ink hover:bg-surface-50"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    disabled={page >= data.totalPages}
                    onClick={() => setParam("page", String(page + 1))}
                    className="rounded-xl border border-surface-200 px-4 py-2.5 font-heading text-xs tracking-wider text-ink-muted hover:text-ink hover:border-ink-dim transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  )
}
