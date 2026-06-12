import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        variants: {
          select: { id: true, size: true, stock: true },
          orderBy: { size: "asc" },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product detail error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
