import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  imageUrl,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group relative block overflow-hidden rounded-xl bg-surface-50 border border-surface-200 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]"
    >
      <div className="aspect-square overflow-hidden bg-surface-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-5">
        <p className="font-heading text-xs tracking-[0.2em] text-accent uppercase">
          {brand}
        </p>
        <h3 className="mt-1.5 font-body text-sm font-medium text-ink group-hover:text-accent transition-colors duration-300 leading-tight">
          {name}
        </h3>
        <p className="mt-3 font-heading text-lg tracking-wide text-ink">
          ₱{price.toLocaleString()}
        </p>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <svg className="w-4 h-4 text-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
