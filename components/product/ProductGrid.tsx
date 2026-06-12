import ProductCard from "./ProductCard"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string | null
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="col-span-full py-16 text-center text-ink-muted">
        No products found.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
        >
          <ProductCard
            {...product}
            imageUrl={product.imageUrl ?? ""}
          />
        </div>
      ))}
    </div>
  )
}
