"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function usePageLoadAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll<HTMLElement>("[data-animate]")
    const directions = ["slide-right", "slide-left"]

    targets.forEach((target, i) => {
      const direction = directions[i % 2]
      const delay = i * 100
      target.classList.add(`animate-${direction}`)
      target.style.animationDelay = `${delay}ms`
      target.style.opacity = "1"
    })

    return () => {
      targets.forEach((target) => {
        target.classList.remove("animate-slide-right", "animate-slide-left")
        target.style.animationDelay = ""
      })
    }
  }, [pathname])

  return ref
}
