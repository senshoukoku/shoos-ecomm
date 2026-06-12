import { create } from "zustand"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
}

interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isStreaming: boolean
  addMessage: (msg: ChatMessage) => void
  updateLastMessage: (content: string, replace?: boolean) => void
  toggleOpen: () => void
  clearChat: () => void
}

const STORAGE_KEY = "sneaker-chat"
const MAX_MESSAGES = 50

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: loadMessages(),
  isOpen: false,
  isStreaming: false,

  addMessage: (msg) => {
    const updated = [...get().messages, msg].slice(-MAX_MESSAGES)
    set({ messages: updated })
    saveMessages(updated)
  },

  updateLastMessage: (content, replace = false) => {
    const msgs = get().messages
    if (msgs.length === 0) return
    const updated = msgs.map((m, i) =>
      i === msgs.length - 1 ? { ...m, content: replace ? content : m.content + content } : m
    )
    set({ messages: updated })
    saveMessages(updated)
  },

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),

  clearChat: () => {
    set({ messages: [] })
    saveMessages([])
  },
}))
