import { prisma } from "@/lib/prisma"

type CatalogProduct = {
  id: string
  name: string
  brand: string
  price: number
  description: string
  imageUrls: string[]
  variants: { size: string; stock: number }[]
}

let cachedCatalog: CatalogProduct[] | null = null
let lastFetch = 0
const CACHE_TTL = 60_000

export async function buildSystemPrompt(): Promise<string> {
  const now = Date.now()
  if (cachedCatalog && now - lastFetch < CACHE_TTL) {
    return buildPromptFromCatalog(cachedCatalog)
  }

  const products = await prisma.product.findMany({
    include: { variants: true },
  })

  cachedCatalog = products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: Number(p.price),
    description: p.description,
    imageUrls: p.imageUrls,
    variants: p.variants.map((v) => ({
      size: v.size,
      stock: v.stock,
    })),
  }))
  lastFetch = now

  return buildPromptFromCatalog(cachedCatalog)
}

function buildPromptFromCatalog(catalog: CatalogProduct[]): string {
  return `You are a sneaker store assistant for SNEAKER VAULT. You help customers find products, answer questions about sizing, brands, pricing, and availability.

Here is the full product catalog in JSON:
${JSON.stringify(catalog, null, 2)}

Rules:
- Only answer questions based on the product catalog above. Do not make up products, prices, or stock info.
- If a product is out of stock in a size, suggest alternatives from the same brand or similar price range.
- Be concise, friendly, and knowledgeable.
- If asked about something outside the catalog, politely explain you can only help with products in the store.
- Format prices with ₱ (PHP peso sign).
- Do not mention specific product IDs to the customer.`
}
