"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { registerUser } from "./actions"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("confirmPassword", confirmPassword)

    const result = await registerUser(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (signInResult?.error) {
      setLoading(false)
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl tracking-widest text-ink hover:text-accent transition-colors">
            SHOOOS
          </Link>
          <h1 className="mt-6 font-heading text-3xl text-ink">Create Account</h1>
          <p className="mt-2 font-body text-sm text-ink-muted">Join the community</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="font-heading text-xs tracking-[0.15em] text-ink-muted">
              CONFIRM PASSWORD
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-body text-sm text-ink placeholder-ink-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3.5 font-heading text-sm tracking-wider text-surface hover:bg-accent-dark transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-accent hover:text-accent-light transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
