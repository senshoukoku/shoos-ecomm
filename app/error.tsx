"use client"

import Link from "next/link"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 text-center">
      <div>
        <p className="font-heading text-8xl text-red-400/30 leading-none">500</p>
        <h1 className="mt-4 font-heading text-4xl text-ink">Something went wrong</h1>
        <p className="mt-3 font-body text-ink-muted max-w-md mx-auto leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="rounded-xl border border-surface-200 px-8 py-4 font-heading text-sm tracking-wider text-ink-muted hover:text-ink transition-all duration-200"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
