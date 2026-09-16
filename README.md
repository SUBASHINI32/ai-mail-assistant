# AI Mail - Autonomous AI-Controlled Mail Web Application

AI Mail is a Next.js App Router email web application where the AI assistant directly **controls the Mail UI**. 
Unlike conversational chatbots that merely answer questions in a chat window, AI Mail's assistant interprets natural language instructions into strongly-typed structured actions via the xAI Grok API (JSON Schema structured output) and deterministically executes them on the frontend—navigating pages, populating forms, applying filters, and opening messages.

---

## Key Features

1. **AI-Driven UI Control (No Chatbot)**:
   - Natural language commands directly trigger frontend actions.
   - Populates Compose draft fields (`to`, `subject`, `body`) in real time.
   - Filters the inbox by relative date window (e.g. "last 7 days") or sender.
   - Opens specific or newest emails.
   - Prepares contextual replies with quoted text.
   - Navigates between Inbox, Sent, and Compose views.
2. **Zero Regex Intent Detection**:
   - No brittle substring matching or regex parsing.
   - Full semantic understanding powered by xAI Grok (`grok-4.3`) with strict structured output.
3. **Robust Clarification & Ambiguity Handling**:
   - If a command lacks critical information (e.g., "Send an email" without recipient or body), the AI returns a `clarify` action prompting the user for details without mutating the UI or guessing parameters.
4. **Shared In-Memory State Architecture**:
   - Mail state (`emails`, `sentEmails`, filters, compose draft, active email) is maintained across App Router routes in a unified React Context (`MailProvider`).
   - No heavy dependencies like Redux or Zustand; no databases, Prisma, or external mail providers.
5. **Modern Minimalist 3-Column Interface**:
   - **Left Sidebar**: Navigation (Inbox with unread counter, Sent with message count, Compose).
   - **Center Area**: Main mailbox view (Inbox list, Email detail, Compose form, Sent archive).
   - **Right Sidebar**: Dedicated AI Controller panel with conversation history, visual action execution receipts, and 1-click suggested command chips.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI & Styling**: React 18, Tailwind CSS, Lucide React icons
- **Backend / APIs**: Next.js Route Handlers (`/api/ai`, `/api/send`)
- **AI / LLM**: xAI Grok API (`https://api.x.ai/v1`, model: `grok-4.3`), structured JSON schema outputs
- **State Management**: React `createContext`, `useContext`, `useState`, `useMemo`

---

## Folder Structure

```
ai-mail-assistant/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── route.ts         # Route Handler: Validates and runs LLM action planner
│   │   └── send/
│   │       └── route.ts         # Route Handler: In-memory email send endpoint
│   ├── compose/
│   │   └── page.tsx             # Compose email page
│   ├── email/
│   │   └── [id]/
│   │       └── page.tsx         # Email detail reading view
│   ├── inbox/
│   │   └── page.tsx             # Inbox view with active filter indicators
│   ├── sent/
│   │   └── page.tsx             # Sent messages archive
│   ├── globals.css              # Tailwind CSS directives and styles
│   ├── layout.tsx               # Root layout with MailProvider & MailLayout
│   └── page.tsx                 # Root redirect to /inbox
│
├── components/
│   ├── Assistant.tsx            # Pinned AI Controller panel with history & quick chips
│   ├── Compose.tsx              # Controlled compose form (reactive to AI draft updates)
│   ├── EmailList.tsx            # Mail row renderer with unread badges & dates
│   ├── EmailView.tsx            # Email detail view with reply & back actions
│   ├── Inbox.tsx                # Inbox header, filter badges, and email list
│   ├── MailLayout.tsx           # 3-column desktop shell with toast notifications
│   ├── Sent.tsx                 # Sent emails list
│   └── Sidebar.tsx              # Left navigation sidebar with badges
│
├── data/
│   └── mockEmails.ts            # Realistic mock emails spanning the last 30 days
│
├── lib/
│   ├── actions.ts               # Action descriptor and reply draft utilities
│   ├── ai.ts                    # xAI Grok client, system prompt, and JSON Schema
│   ├── context.tsx              # Central MailContext and executeAIAction dispatcher
│   └── types.ts                 # Strongly-typed definitions (Email, AIAction, Draft)
│
├── .env.local.example           # Example environment file for XAI_API_KEY
├── .gitignore                   # Git ignore rules
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies and npm scripts
├── postcss.config.mjs           # PostCSS Tailwind plugins
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation
```

---

## AI Architecture: The Action Execution Pipeline

```
User Command (Natural Language)
               │
               ▼
   POST /api/ai (Next.js Route Handler)
               │
               ▼
   xAI Grok-2 (System Prompt + Strict JSON Schema via https://api.x.ai/v1)
               │
               ▼
   Structured AIAction JSON
               │
               ▼
   executeAIAction(action) (Frontend UI Controller in lib/context.tsx)
               │
               ├─────────────────────────┬─────────────────────────┐
               ▼                         ▼                         ▼
      router.push(...)          React State Updates      Assistant Chat Receipt
 (e.g. /compose, /email/1)     (draft, filters, etc.)    (visual action card)
               │                         │                         │
               └─────────────────────────┴─────────────────────────┘
                                         │
                                         ▼
                            Visible UI State Change
```

### Action Schema

```typescript
export type AIAction =
  | {
      action: "compose";
      to: string;
      subject: string;
      body: string;
    }
  | {
      action: "filter";
      days: number;
    }
  | {
      action: "open_email";
      email_id: string;
    }
  | {
      action: "reply";
      email_id?: string;
      body?: string;
    }
  | {
      action: "navigate";
      page: "inbox" | "sent" | "compose";
    }
  | {
      action: "filter_sender";
      sender: string;
    }
  | {
      action: "clarify";
      question: string;
    };
```

---

## Environment Setup & Installation

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and insert your xAI API key:
```env
XAI_API_KEY=xai-...
```

> **Note**: If `XAI_API_KEY` is not set or is invalid, the backend gracefully catches the error and returns a helpful clarification message in the assistant panel without crashing the application.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## Example AI Commands to Test

You can type any of these in the AI Assistant input or click the built-in suggested command chips:

1. **Populate Compose Form**:
   > `"Send email to hari@gmail.com with subject meeting and body let's meet tomorrow"`
   *Result*: UI automatically navigates to `/compose`, and the `To`, `Subject`, and `Body` fields are visibly filled.

2. **Filter by Date Range**:
   > `"Show emails from last 7 days"`
   *Result*: Inbox visibly updates to show only emails received within the last 7 days; an active filter pill appears with a "Clear Filter" button.

3. **Open Most Recent Email**:
   > `"Open latest email"`
   *Result*: AI identifies the newest email in the context and navigates to `/email/[id]`, displaying the full message and marking it as read.

4. **Open Email by Sender / Topic**:
   > `"Open the email from HR"`
   *Result*: Opens the Annual Performance Reviews email from `hr@company.com`.

5. **Reply to Opened Email**:
   > *(From an open email)*: `"Reply to this"`
   *Result*: Navigates to `/compose` with recipient set to the original sender, subject set to `Re: <original subject>`, and the original body quoted.

6. **Navigate Views**:
   > `"Go to sent mail"` or `"Open compose"` or `"Go to inbox"`
   *Result*: UI switches views instantly.

7. **Handle Ambiguity (Clarification)**:
   > `"Send an email"`
   *Result*: The AI recognizes missing recipient and content, returning a `clarify` action asking who you would like to email, without touching the UI.

---

## How to Extend the Action Schema

1. **Add new action variant in `lib/types.ts`**:
   ```typescript
   | { action: "star_email"; email_id: string }
   ```
2. **Update JSON Schema & Prompt in `lib/ai.ts`**:
   Add `"star_email"` to the `enum` in `actionJsonSchema` and describe it in `SYSTEM_PROMPT`.
3. **Handle in `executeAIAction` (`lib/context.tsx`)**:
   ```typescript
   case "star_email": {
     setEmails(prev => prev.map(e => e.id === action.email_id ? { ...e, starred: true } : e));
     showToast("Email starred", "info");
     break;
   }
   ```
