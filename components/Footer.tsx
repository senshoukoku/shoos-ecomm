"use client"

import Link from "next/link"
import { useState } from "react"

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
    setTimeout(() => {
      setSent(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl border border-surface-200 bg-surface p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-ink-dim hover:text-ink transition-colors"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <svg className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-heading text-xl text-ink">Message Sent!</p>
            <p className="text-sm text-ink-muted">We&apos;ll get back to you shortly.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="font-heading text-2xl text-ink">Get in Touch</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Have a question or feedback? We&apos;d love to hear from you.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-ink-muted mb-1">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-ink-muted mb-1">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-ink-muted mb-1">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  className="w-full rounded-lg border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-surface hover:bg-accent-dark disabled:opacity-60 transition-all duration-200"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <footer className="border-t border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="font-heading text-2xl tracking-widest text-ink hover:text-accent transition-colors duration-300">
                SH000S
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Premium sneakers for those who refuse to blend in. Quality craftsmanship meets bold design.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink-dim">Quick Links</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/products" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Limited Edition
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink-dim">Support</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="text-sm text-ink-muted hover:text-ink transition-colors duration-200"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <Link href="/" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink-dim">Connect</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors duration-200">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-200">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-ink-dim">
              &copy; {new Date().getFullYear()} SHOOOS. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setContactOpen(true)}
                className="group flex items-center gap-1.5 text-xs text-ink-dim hover:text-accent transition-colors duration-200"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Contact
              </button>
              <Link href="/" className="text-xs text-ink-dim hover:text-accent transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/" className="text-xs text-ink-dim hover:text-accent transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
