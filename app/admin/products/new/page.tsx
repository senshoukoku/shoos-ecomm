"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminGuard from "@/components/admin/AdminGuard"

const SIZE_OPTIONS = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"]

export default function NewProductPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [brand, setBrand] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrls, setImageUrls] = useState([""])
  const [variants, setVariants] = useState([{ size: "", stock: 0 }])

  function addImageUrl() {
    setImageUrls((prev) => [...prev, ""])
  }

  function removeImageUrl(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  function updateImageUrl(index: number, value: string) {
    setImageUrls((prev) => prev.map((u, i) => (i === index ? value : u)))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { size: "", stock: 0 }])
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  function updateVariant(index: number, field: "size" | "stock", value: string | number) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsedPrice = parseFloat(price)
    if (!name || !description || !brand || isNaN(parsedPrice)) {
      setError("Please fill in all required fields.")
      return
    }

    const validVariants = variants.filter((v) => v.size && v.stock >= 0)
    if (validVariants.length === 0) {
      setError("Please add at least one variant with size and stock.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          brand,
          price: parsedPrice,
          imageUrls: imageUrls.filter(Boolean),
          variants: validVariants,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create product")
      }

      router.push("/admin/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="font-heading text-xs tracking-[0.25em] text-accent">ADMIN</p>
        <h1 className="mt-1 font-heading text-4xl text-ink">New Product</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-800/50 bg-red-900/20 px-5 py-3.5">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="font-heading text-xs tracking-[0.15em] text-ink-muted">NAME *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              placeholder="Product name" />
          </div>

          <div>
            <label className="font-heading text-xs tracking-[0.15em] text-ink-muted">DESCRIPTION *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              placeholder="Product description" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-heading text-xs tracking-[0.15em] text-ink-muted">BRAND *</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
                placeholder="e.g. Nike" />
            </div>
            <div>
              <label className="font-heading text-xs tracking-[0.15em] text-ink-muted">PRICE *</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
                placeholder="0.00" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="font-heading text-xs tracking-[0.15em] text-ink-muted">IMAGE URLs</label>
              <button type="button" onClick={addImageUrl} className="text-xs text-accent hover:text-accent-light transition-colors">+ Add URL</button>
            </div>
            {imageUrls.map((url, i) => (
              <div key={i} className="mt-2 flex gap-2">
                <input type="text" value={url} onChange={(e) => updateImageUrl(i, e.target.value)}
                  className="flex-1 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
                  placeholder="https://picsum.photos/id/..." />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => removeImageUrl(i)} className="text-sm text-red-400 hover:text-red-300 transition-colors">Remove</button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="font-heading text-xs tracking-[0.15em] text-ink-muted">VARIANTS (SIZE / STOCK) *</label>
              <button type="button" onClick={addVariant} className="text-xs text-accent hover:text-accent-light transition-colors">+ Add Variant</button>
            </div>
            {variants.map((variant, i) => (
              <div key={i} className="mt-2 flex gap-2">
                <select value={variant.size} onChange={(e) => updateVariant(i, "size", e.target.value)}
                  className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all">
                  <option value="">Select size</option>
                  {SIZE_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                <input type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                  className="w-24 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
                  placeholder="Stock" />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-sm text-red-400 hover:text-red-300 transition-colors">Remove</button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting}
              className="rounded-xl bg-accent px-8 py-3 font-heading text-xs tracking-wider text-surface hover:bg-accent-dark transition-all duration-200 disabled:opacity-50">
              {submitting ? "CREATING..." : "CREATE PRODUCT"}
            </button>
            <button type="button" onClick={() => router.push("/admin/products")}
              className="rounded-xl border border-surface-200 px-8 py-3 font-heading text-xs tracking-wider text-ink-muted hover:text-ink transition-all">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </AdminGuard>
  )
}
