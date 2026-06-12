"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useCartStore } from "@/store/cart"
import { useTheme } from "@/components/ThemeProvider"

export default function Navbar() {
  const { data: session } = useSession()
  const totalItems = useCartStore((s) => s.totalItems())
  const openCart = useCartStore((s) => s.openCart)
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const user = session?.user

  const linkClass = "text-sm font-medium text-ink-muted hover:text-ink transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"

  return (
    <nav className="sticky top-0 z-40 border-b border-surface-200 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-2xl tracking-widest text-ink hover:text-accent transition-colors duration-300">
          SH000S
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/products" className={linkClass}>
            Products
          </Link>

          {!user && (
            <>
              <Link href="/login" className={linkClass}>
                Login
              </Link>
              <Link href="/register" className={linkClass}>
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href="/account" className={linkClass}>
                My Account
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className={linkClass}>
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-ink-dim hover:text-red-400 transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 text-ink-muted hover:text-ink transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          <button
            onClick={openCart}
            className="relative p-2 text-ink-muted hover:text-ink transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-surface">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button onClick={openCart} className="relative p-2 text-ink-muted hover:text-ink transition-colors duration-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-surface">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-ink-muted hover:text-ink transition-colors duration-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 border-t border-surface-200" : "max-h-0"
        } md:hidden`}
      >
        <div className="space-y-1 px-4 py-3">
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
            Products
          </Link>
          {!user && (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                Login
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              <Link href="/account" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                My Account
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={() => { toggleTheme(); setMenuOpen(false) }} className="block py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <button onClick={() => signOut()} className="block py-2 text-sm font-medium text-ink-dim hover:text-red-400 transition-colors">
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
