"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cart"
import Link from "next/link"

interface Variant {
  id: string
  size: string
  stock: number
}

interface Product {
  id: string
  name: string
  description: string
  brand: string
  price: number
  imageUrls: string[]
  variants: Variant[]
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((p) => { if (!cancelled) setProduct(p) })
      .catch(() => { if (!cancelled) setProduct(null) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-surface-50" />
          <div className="space-y-6">
            <div className="h-4 w-20 rounded bg-surface-50" />
            <div className="h-10 w-72 rounded bg-surface-50" />
            <div className="h-8 w-32 rounded bg-surface-50" />
            <div className="h-24 w-full rounded bg-surface-50" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-ink-muted font-body">Product not found.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-2 font-heading text-xs tracking-wider text-accent hover:text-accent-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            BACK TO CATALOG
          </Link>
        </div>
      </div>
    )
  }

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize
  )
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false
  const outOfStock = selectedVariant && selectedVariant.stock === 0

  function handleAddToCart() {
    if (!selectedSize || !inStock || !product) return
    addItem({
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      imageUrl: product.imageUrls[0] ?? "",
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 font-heading text-xs tracking-wider text-ink-muted hover:text-accent transition-colors mb-8 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        BACK
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="animate-fade-in">
          <div className="aspect-square overflow-hidden rounded-2xl bg-surface-50 border border-surface-200">
            <img
              src={product.imageUrls[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.imageUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    i === selectedImage
                      ? "border-accent ring-1 ring-accent/30"
                      : "border-surface-200 hover:border-ink-dim"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start animate-fade-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <p className="font-heading text-xs tracking-[0.25em] text-accent">
            {product.brand}
          </p>
          <h1 className="mt-2 font-heading text-4xl text-ink leading-tight">
            {product.name}
          </h1>
          <p className="mt-4 font-heading text-3xl tracking-wide text-ink">
            ₱{product.price.toLocaleString()}
          </p>
          <p className="mt-6 font-body text-sm leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="font-heading text-xs tracking-[0.2em] text-ink-muted">SELECT SIZE</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedSize === variant.size
                const isZero = variant.stock === 0
                return (
                  <button
                    key={variant.id}
                    disabled={isZero}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`h-12 w-14 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-accent bg-accent text-surface"
                        : isZero
                          ? "cursor-not-allowed border-surface-200 text-ink-dim/30 line-through"
                          : "border-surface-200 text-ink-muted hover:border-ink-dim hover:text-ink"
                    }`}
                  >
                    {variant.size}
                  </button>
                )
              })}
            </div>
            {selectedSize && (
              <p className="mt-3 font-body text-xs text-ink-dim">
                {outOfStock
                  ? "Out of Stock"
                  : `In Stock: ${selectedVariant!.stock}`}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || outOfStock}
            className="mt-8 w-full rounded-xl bg-accent px-6 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {added
              ? "ADDED TO CART!"
              : !selectedSize
                ? "SELECT A SIZE"
                : outOfStock
                  ? "OUT OF STOCK"
                  : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  )
}
