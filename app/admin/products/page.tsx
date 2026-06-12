"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminGuard from "@/components/admin/AdminGuard"

type VariantSummary = {
  id: string
  size: string
  stock: number
}

type Product = {
  id: string
  name: string
  brand: string
  price: number
  variants: VariantSummary[]
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products")
      const data = await res.json()
      if (data.products) setProducts(data.products)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      return
    }
    const data = await res.json()
    alert(data.error || "Failed to delete product")
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="p-12 text-center"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" /></div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-heading text-xs tracking-[0.25em] text-accent">ADMIN</p>
            <h1 className="mt-1 font-heading text-4xl text-ink">Products</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="rounded-xl bg-accent px-6 py-3 font-heading text-xs tracking-wider text-surface hover:bg-accent-dark transition-all duration-200"
          >
            ADD PRODUCT
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-surface-200">
          <table className="w-full text-left font-body text-sm">
            <thead className="border-b border-surface-200 bg-surface-50 text-ink-muted">
              <tr>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">NAME</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">BRAND</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">PRICE</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">VARIANTS</th>
                <th className="px-5 py-4 font-heading text-xs tracking-[0.15em]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {products.map((product) => (
                <tr key={product.id} className="text-ink transition-colors hover:bg-surface-50">
                  <td className="px-5 py-4 font-medium">{product.name}</td>
                  <td className="px-5 py-4 text-ink-muted">{product.brand}</td>
                  <td className="px-5 py-4 font-heading tracking-wide">₱{product.price.toLocaleString()}</td>
                  <td className="px-5 py-4">{product.variants.length}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        className="rounded-xl bg-surface-100 px-4 py-2 font-heading text-xs tracking-wider text-ink-muted hover:text-ink hover:bg-surface-200 transition-all"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="rounded-xl border border-red-800/30 px-4 py-2 font-heading text-xs tracking-wider text-red-400 hover:bg-red-900/20 transition-all"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-ink-muted">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  )
}
