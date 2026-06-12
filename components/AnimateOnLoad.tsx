"use client"

import { usePageLoadAnimation } from "@/lib/usePageLoadAnimation"

export default function AnimateOnLoad({ children }: { children: React.ReactNode }) {
  const ref = usePageLoadAnimation()

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}
