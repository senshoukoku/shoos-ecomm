"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface px-4">
        <div className="text-center">
          <p className="font-heading text-6xl text-red-400/30 leading-none">403</p>
          <h1 className="mt-4 font-heading text-3xl text-ink">Access Denied</h1>
          <p className="mt-2 font-body text-ink-muted">You do not have permission to access this area.</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
