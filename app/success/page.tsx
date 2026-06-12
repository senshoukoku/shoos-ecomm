import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import Link from "next/link"
import { redirect } from "next/navigation"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
})

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { session_id } = searchParams
  if (!session_id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-heading text-4xl text-ink">No session ID</h1>
        <p className="mt-3 font-body text-ink-muted">We could not find your order details.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    )
  }

  let orderId: string | null = null
  let totalAmount = 0
  let items: { productName: string; quantity: number; price: number }[] = []

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    })

    orderId = stripeSession.metadata?.orderId ?? null
    totalAmount = stripeSession.amount_total ?? 0

    if (stripeSession.line_items?.data) {
      items = stripeSession.line_items.data.map((li) => ({
        productName: li.description ?? "Item",
        quantity: li.quantity ?? 1,
        price: (li.amount_total ?? 0) / 100,
      }))
    }
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-heading text-4xl text-ink">Session not found</h1>
        <p className="mt-3 font-body text-ink-muted">Could not retrieve payment details.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    )
  }

  let dbOrder: { id: string; status: string; createdAt: Date } | null = null
  if (orderId) {
    dbOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true, createdAt: true },
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
        <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="mt-6 font-heading text-5xl text-ink">Order Confirmed!</h1>
      <p className="mt-3 font-body text-ink-muted text-lg">Thank you for your purchase.</p>

      {dbOrder && (
        <p className="mt-4 font-body text-xs text-ink-dim">
          Order ID: <span className="font-mono text-accent">{dbOrder.id}</span>
        </p>
      )}

      <div className="mt-10 rounded-2xl border border-surface-200 bg-surface-50 text-left">
        <div className="border-b border-surface-200 px-5 py-4">
          <h2 className="font-heading text-sm tracking-[0.2em] text-ink-muted">ITEMS</h2>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between border-b border-surface-100 px-5 py-3.5 font-body text-sm">
            <span className="text-ink">
              {item.productName} <span className="text-ink-dim">x{item.quantity}</span>
            </span>
            <span className="font-medium text-ink">₱{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between px-5 py-4 font-heading text-xl tracking-wide">
          <span className="text-ink-muted">Total</span>
          <span className="text-ink">₱{(totalAmount / 100).toLocaleString()}</span>
        </div>
      </div>

      <Link
        href="/products"
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200"
      >
        CONTINUE SHOPPING
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  )
}
