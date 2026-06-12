"use client"

import { useCartStore } from "@/store/cart"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import Link from "next/link"

export default function CartDrawer() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const totalItems = useCartStore((s) => s.totalItems)

  return (
    <Transition show={isOpen}>
      <Dialog onClose={closeCart} className="relative z-50">
        <TransitionChild
          key="backdrop"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-start justify-end">
          <TransitionChild
            key="panel"
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="h-full w-full sm:max-w-md bg-surface border-l border-surface-200 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between border-b border-surface-200 px-6 py-5">
                <DialogTitle className="font-heading text-xl tracking-wide text-ink">
                  Cart ({totalItems()})
                </DialogTitle>
                <button
                  onClick={closeCart}
                  className="text-ink-dim hover:text-ink transition-colors duration-200"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                  <p className="text-center text-ink-muted mt-12">
                    Your cart is empty.
                  </p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-surface-200 pb-4">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-20 w-20 object-cover rounded-lg bg-surface-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-xs tracking-[0.15em] text-accent uppercase">
                          {item.brand}
                        </p>
                        <p className="font-body text-sm text-ink truncate mt-0.5">
                          {item.productName}
                        </p>
                        <p className="text-xs text-ink-dim mt-0.5">
                          Size: {item.size}
                        </p>
                        <p className="font-heading text-base text-ink mt-1.5 tracking-wide">
                          ₱{item.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 rounded border border-surface-200 bg-surface-50 text-ink-muted hover:text-ink hover:border-ink-dim transition-all text-sm flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="font-body text-sm text-ink w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 rounded border border-surface-200 bg-surface-50 text-ink-muted hover:text-ink hover:border-ink-dim transition-all text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-xs text-ink-dim hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-surface-200 px-6 py-5 space-y-4">
                  <div className="flex justify-between font-heading text-lg tracking-wide">
                    <span className="text-ink-muted">Subtotal</span>
                    <span className="text-ink">₱{totalPrice().toLocaleString()}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full rounded-lg bg-accent px-4 py-3 text-center font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={closeCart}
                    className="block w-full text-center text-sm text-ink-dim hover:text-ink transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
