# Phase 6 — AI Product Assistant Chat

## Goal
Floating AI chat bubble powered by Groq API that answers product catalog questions.

## Steps

### 6.1 Update Spec Documents
**FUNCTIONS.md** — Add Section 7 under Core Features:
> **7. AI Product Assistant Bot** — Floating chat bubble visible on every page. Answers natural language questions about products, sizing, brands, and availability. Powered by Groq API with streaming responses. Chat history persists in localStorage during session. Available to guests and logged-in users. Suggested prompts shown on first open.

**AGENTS.md** — Three edits:
1. Remove `❌ Chat, comments, live notifications` from forbidden list
2. Add to tech stack: `- **AI Chat:** Groq API (\`groq-sdk\`) + llama-3.3-70b model`
3. Add to API routes table: `| POST | /api/chat | AI product assistant chat (streaming) | Public |`

### 6.2 Chat Context Builder
Create `lib/chat-context.ts`:
- Function to fetch all products from DB at build/startup (or on each request)
- Build system prompt string with full product catalog JSON
- System prompt structure:
  - Role definition: "You are a sneaker store assistant for SNEAKER VAULT"
  - Full product catalog: name, brand, price, description, available sizes with stock
  - Rules: only answer from catalog, don't make up info, be concise, suggest alternatives
  - Tone: friendly, helpful, knowledgeable

### 6.3 Chat API Route
Create `app/api/chat/route.ts`:
- POST handler
- Accept `{ messages: { role, content }[] }`
- Build system prompt with current product catalog
- Call Groq SDK with streaming:
```ts
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const stream = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [systemPrompt, ...userMessages],
  stream: true,
})
```
- Return streaming response (Server-Sent Events via `ReadableStream`)
- Error handling: return 500 JSON with user-friendly message

### 6.4 Chat Store
Create `store/chat.ts` (Zustand):
```ts
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isStreaming: boolean
  addMessage: (msg: ChatMessage) => void
  updateLastMessage: (content: string) => void
  toggleOpen: () => void
  clearChat: () => void
}
```
- Persist to localStorage key: `sneaker-chat`
- Max 50 messages in history

### 6.5 ChatBubble Component
Create `components/chat/ChatBubble.tsx`:
- Fixed bottom-right: `fixed bottom-6 right-6 z-50`
- Closed state: small circular button with chat icon
- Open state: renders ChatWindow
- Animate presence (fade + slide up) — subtle only
- Import and render in root layout

### 6.6 ChatWindow Component
Create `components/chat/ChatWindow.tsx`:
- Fixed dimensions: `w-96 h-[500px]` rounded card with shadow
- Sections:
  - **Header**: "👟 Sneaker Assistant" + close (X) button
  - **Messages**: scrollable container, auto-scroll to bottom
    - User messages: right-aligned, branded color
    - Assistant messages: left-aligned, neutral bg
    - Streaming: show typing indicator (animated dots)
    - Empty state: welcome message + 3 suggested prompt chips
  - **Input**: text input + send button, disabled while streaming
  - Suggested prompts (on empty state):
    - "What's the most expensive sneaker?"
    - "Do you have Nike in size 42?"
    - "Which shoes are under ₱5,000?"

### 6.7 Integrate into Layout
In `app/layout.tsx`:
```tsx
<ChatBubble />
```
Place after `<main>` but before closing `<body>`.

### 6.8 Rate Limiting Note
Groq free tier: 30 requests/min, 6 req/min for specific models.
For a portfolio site this is sufficient. Add a simple client-side cooldown (disable send for 2s after each message) to prevent accidental spam.

## Key Files
- `lib/chat-context.ts`
- `app/api/chat/route.ts`
- `store/chat.ts`
- `components/chat/ChatBubble.tsx`
- `components/chat/ChatWindow.tsx`
- `app/layout.tsx` (add ChatBubble)
- `instructions/FUNCTIONS.md` (edit)
- `instructions/AGENTS.md` (edit)
