import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 text-center">
      <div>
        <p className="font-heading text-8xl text-accent/30 leading-none">404</p>
        <h1 className="mt-4 font-heading text-4xl text-ink">Page Not Found</h1>
        <p className="mt-3 font-body text-ink-muted max-w-md mx-auto leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200"
        >
          BACK TO HOME
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
