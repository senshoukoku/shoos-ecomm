import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const VALID_STATUSES = ["pending", "paid", "shipped", "delivered"]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get("status")?.trim().toLowerCase() || null

    if (statusParam && !VALID_STATUSES.includes(statusParam)) {
      return NextResponse.json({ error: "Invalid status filter" }, { status: 400 })
    }

    const where = statusParam ? { status: statusParam } : {}

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Admin orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
