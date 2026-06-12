"use client"

import { useToastStore } from "@/store/toast"

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl px-5 py-3.5 font-body text-sm shadow-2xl animate-fade-up border backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-green-900/80 border-green-700/50 text-green-200'
              : toast.type === 'error'
                ? 'bg-red-900/80 border-red-700/50 text-red-200'
                : 'bg-surface-50/80 border-surface-200 text-ink'
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-ink-dim hover:text-ink transition-colors ml-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
