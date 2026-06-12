import { create } from "zustand"

let toastCounter = 0
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: Toast["type"]) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    const id = `toast-${++toastCounter}-${Date.now()}`
    set({ toasts: [...get().toasts, { id, message, type }] })
    const timer = setTimeout(() => {
      timers.delete(id)
      const current = get().toasts
      if (current.some((t) => t.id === id)) {
        get().removeToast(id)
      }
    }, 4000)
    timers.set(id, timer)
  },
  removeToast: (id) => {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    set({ toasts: get().toasts.filter((t) => t.id !== id) })
  },
}))
