import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
})

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, shippingAddress } = await req.json()

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: "Missing items or shipping address" }, { status: 400 })
    }

    const { fullName, address, city, zipCode, country } = shippingAddress
    if (!fullName || !address || !city || !zipCode || !country) {
      return NextResponse.json({ error: "All shipping address fields are required" }, { status: 400 })
    }

    const verifiedItems = []
    for (const item of items) {
      if (!item.productId || !item.productName || !item.size || !item.quantity || !item.price) {
        return NextResponse.json({ error: "Invalid item data" }, { status: 400 })
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { price: true },
      })
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productName}` },
          { status: 400 }
        )
      }
      if (product.price !== item.price) {
        return NextResponse.json(
          { error: `Price mismatch for ${item.productName}. Please refresh the page.` },
          { status: 400 }
        )
      }

      const variant = await prisma.productVariant.findFirst({
        where: { productId: item.productId, size: item.size },
      })
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.productName} (size ${item.size})` },
          { status: 400 }
        )
      }

      verifiedItems.push({ ...item, price: product.price })
    }

    const total = verifiedItems.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0)

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        status: "pending",
        items: {
          create: verifiedItems.map((item: { productId: string; productName: string; size: string; quantity: number; price: number }) => ({
            productId: item.productId,
            productName: item.productName,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: verifiedItems.map((item: { productName: string; price: number; quantity: number }) => ({
        price_data: {
          currency: "php",
          product_data: { name: item.productName },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        shippingAddress: JSON.stringify(shippingAddress),
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
