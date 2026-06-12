"use client"

import { useState, useRef, useEffect } from "react"
import { useChatStore, type ChatMessage } from "@/store/chat"

const SUGGESTED_PROMPTS = [
  "What's the most expensive sneaker?",
  "Do you have Nike in size 42?",
  "Which shoes are under ₱5,000?",
]

export default function ChatWindow() {
  const { messages, isStreaming, addMessage, updateLastMessage, clearChat } =
    useChatStore()
  const [input, setInput] = useState("")
  const [cooldown, setCooldown] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus()
    }
  }, [isStreaming])

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  async function sendMessage(content: string) {
    if (!content.trim() || isStreaming || cooldown) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      createdAt: Date.now(),
    }
    addMessage(userMsg)
    setInput("")

    const placeholder: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    }
    addMessage(placeholder)

    useChatStore.setState({ isStreaming: true })

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: useChatStore.getState().messages.slice(0, -1).map(
            (m) => ({ role: m.role, content: m.content })
          ),
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const err = await res.json()
        useChatStore.setState({ isStreaming: false })
        updateLastMessage(err.error || "Something went wrong. Please try again.", true)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        useChatStore.setState({ isStreaming: false })
        updateLastMessage("Connection error. Please try again.", true)
        return
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6)
          if (data === "[DONE]") continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              updateLastMessage(parsed.content)
            }
          } catch {
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      updateLastMessage("Connection error. Please try again.", true)
    }

    useChatStore.setState({ isStreaming: false })
    setCooldown(true)
    setTimeout(() => setCooldown(false), 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col w-96 h-[500px] bg-surface rounded-2xl shadow-2xl border border-surface-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-surface-50 border-b border-surface-200">
        <span className="font-heading text-sm tracking-wider text-ink">SNEAKER AI</span>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-ink-dim hover:text-ink transition-colors"
              aria-label="Clear chat"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => useChatStore.getState().toggleOpen()}
            className="text-ink-dim hover:text-ink transition-colors text-lg leading-none"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <p className="text-sm text-ink-muted max-w-xs leading-relaxed">
              Ask me anything about our sneaker collection!
            </p>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isStreaming || cooldown}
                className="text-sm px-5 py-2.5 rounded-full border border-surface-200 bg-surface-50 text-ink-muted hover:border-accent/50 hover:text-ink transition-all duration-200 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-surface rounded-br-sm"
                  : "bg-surface-50 text-ink border border-surface-200 rounded-bl-sm"
              }`}
            >
              {msg.content || (
                <span className="inline-flex gap-1.5">
                  <span className="w-2 h-2 bg-ink-dim rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-ink-dim rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-ink-dim rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-surface-200 px-5 py-4 flex items-center gap-2 bg-surface-50">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isStreaming || cooldown}
          className="flex-1 font-body text-sm bg-surface border border-surface-200 rounded-xl px-4 py-2.5 text-ink placeholder-ink-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isStreaming || cooldown}
          className="bg-accent text-surface rounded-xl px-4 py-2.5 font-heading text-xs tracking-wider hover:bg-accent-dark disabled:opacity-50 transition-all duration-200"
        >
          Send
        </button>
      </div>
    </div>
  )
}
