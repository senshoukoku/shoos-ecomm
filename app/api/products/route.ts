import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/app/generated/prisma/client"

export const dynamic = "force-dynamic"

function safeInt(value: string | null | undefined, def: number): number {
  if (!value) return def
  const n = parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : def
}

export async function GET(request: NextRequest) {
  try {
    console.log("DATABASE_URL host:", process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).host : "NOT SET")
    const { searchParams } = new URL(request.url)

    const page = safeInt(searchParams.get("page"), 1)
    const limitParam = searchParams.get("limit")?.trim()
    const brand = searchParams.get("brand")?.trim() || null
    const size = searchParams.get("size")?.trim() || null
    const minPrice = searchParams.get("minPrice")?.trim() || null
    const maxPrice = searchParams.get("maxPrice")?.trim() || null

    const where: Prisma.ProductWhereInput = {}

    if (brand) {
      where.brand = { equals: brand, mode: "insensitive" }
    }

    if (size) {
      where.variants = { some: { size } }
    }

    if (minPrice || maxPrice) {
      const priceFilter: Prisma.FloatFilter = {}
      if (minPrice) {
        const parsed = parseFloat(minPrice)
        if (!isNaN(parsed)) priceFilter.gte = parsed
      }
      if (maxPrice) {
        const parsed = parseFloat(maxPrice)
        if (!isNaN(parsed)) priceFilter.lte = parsed
      }
      where.price = priceFilter
    }

    const perPage = Math.min(safeInt(limitParam, 8), 100)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          variants: {
            select: { id: true, size: true, stock: true },
            orderBy: { size: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ])

    const result = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      imageUrls: product.imageUrls,
      imageUrl: product.imageUrls[0] ?? null,
    }))

    return NextResponse.json({
      products: result,
      total,
      page,
      totalPages: Math.ceil(total / perPage),
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
