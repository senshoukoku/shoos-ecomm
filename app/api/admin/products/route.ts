import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const products = await prisma.product.findMany({
      include: {
        variants: {
          select: { id: true, size: true, stock: true },
          orderBy: { size: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Admin products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { name, description, brand, price, imageUrls, variants } = await req.json()

    if (!name || !description || !brand || price == null || !variants?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

      const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }

    if (!Array.isArray(imageUrls)) {
      return NextResponse.json({ error: "Invalid imageUrls" }, { status: 400 })
    }

    for (const v of variants) {
      if (!v.size || typeof v.stock !== "number" || v.stock < 0) {
        return NextResponse.json({ error: "Invalid variant data" }, { status: 400 })
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        price: parsedPrice,
        imageUrls: imageUrls ?? [],
        variants: {
          create: variants.map((v: { size: string; stock: number }) => ({
            size: v.size,
            stock: v.stock,
          })),
        },
      },
      include: {
        variants: {
          select: { id: true, size: true, stock: true },
          orderBy: { size: "asc" },
        },
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
