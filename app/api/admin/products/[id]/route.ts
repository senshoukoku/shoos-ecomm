import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/app/generated/prisma/client"

export const dynamic = "force-dynamic"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

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

    const product = await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { productId: params.id } })

      return tx.product.update({
        where: { id: params.id },
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
    })

    return NextResponse.json({ product })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    console.error("Failed to update product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    console.error("Failed to delete product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
