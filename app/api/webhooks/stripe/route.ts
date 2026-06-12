import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
})

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const orderId = session.metadata?.orderId
      if (!orderId) {
        return NextResponse.json({ error: "Missing orderId in metadata" }, { status: 400 })
      }

      const order = await prisma.order.findUnique({ where: { id: orderId } })
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      const updated = await prisma.order.updateMany({
        where: { id: orderId, status: "pending" },
        data: { status: "paid" },
      })
      if (updated.count === 0) {
        return NextResponse.json({ received: true })
      }

      const orderItems = await prisma.orderItem.findMany({ where: { orderId } })

      await prisma.$transaction(async (tx) => {
        for (const item of orderItems) {
          const variant = await tx.productVariant.findFirst({
            where: { productId: item.productId, size: item.size, stock: { gte: item.quantity } },
          })
          if (!variant) {
            throw new Error(`Insufficient stock for ${item.productName} (size ${item.size})`)
          }
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } },
          })
        }
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
