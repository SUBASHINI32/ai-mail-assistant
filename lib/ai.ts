import OpenAI from "openai";
import { AIAction, Email } from "./types";

const SYSTEM_PROMPT = `You are an AI action planner that controls the user interface of a web-based email client called AI Mail.
You do NOT engage in conversational prose. You do NOT reply with chit-chat.
You MUST return exactly one structured action from the supported actions list that the frontend will execute to control the Mail UI.

SUPPORTED ACTIONS:
1. "compose": Navigate to Compose and populate fields (to, subject, body).
2. "filter": Filter inbox emails to those received within the last N days (e.g. 7 days).
3. "open_email": Navigate to and open a specific email by its ID.
4. "reply": Reply to an email (using the current open email ID or specified email ID).
5. "navigate": Navigate to a specific page ("inbox", "sent", or "compose").
6. "filter_sender": Filter inbox emails by sender email address or sender keyword.
7. "clarify": Ask the user a clarifying question when their request is ambiguous or missing critical information.

CRITICAL RULES:
- Never invent an email ID. Only use actual email IDs provided in the EMAIL CONTEXT.
- If the user asks for "latest email" or "most recent email", inspect the EMAIL CONTEXT, sort/find the email with the most recent date, and use its exact id in an "open_email" action.
- If the user asks to open an email from someone (e.g. "Open the email from HR"), find the matching email from the EMAIL CONTEXT and return "open_email" with its exact id.
- If the user asks to "Reply to this", use the provided CURRENT EMAIL ID. If no email is currently open, ask for clarification.
- Never guess a missing recipient or missing body when the user asks to send an email without providing them (e.g. "Send an email"). If critical details are missing, return "clarify".
- If the user provides a command like "Send email to [email] with subject [subject] and body [body]", return "compose" with to, subject, and body properly set.
- If the user asks to "Show emails from last 7 days", return "filter" with days = 7.
- If the user asks to "Go to sent", "Show sent emails", return "navigate" with page = "sent".
- If the user asks to "Go to inbox", return "navigate" with page = "inbox".
- If the user asks to "Open compose" or "Write new email", return "navigate" with page = "compose".
- If the user asks to show emails from a sender (e.g. "Show emails from hari@gmail.com"), return "filter_sender" with sender = "hari@gmail.com".
- Return pure JSON conforming strictly to the requested schema.`;

const actionJsonSchema = {
  name: "ai_action",
  strict: true,
  schema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["compose", "filter", "open_email", "reply", "navigate", "filter_sender", "clarify"],
        description: "The UI action to execute."
      },
      to: {
        type: ["string", "null"],
        description: "Recipient email for compose action."
      },
      subject: {
        type: ["string", "null"],
        description: "Email subject for compose action."
      },
      body: {
        type: ["string", "null"],
        description: "Email body content for compose or reply action."
      },
      days: {
        type: ["number", "null"],
        description: "Number of days for filter action."
      },
      email_id: {
        type: ["string", "null"],
        description: "Existing email ID for open_email or reply action."
      },
      page: {
        type: ["string", "null"],
        enum: ["inbox", "sent", "compose", null],
        description: "Target page for navigate action."
      },
      sender: {
        type: ["string", "null"],
        description: "Sender email for filter_sender action."
      },
      question: {
        type: ["string", "null"],
        description: "Clarification question when request is ambiguous or missing details."
      }
    },
    required: ["action", "to", "subject", "body", "days", "email_id", "page", "sender", "question"],
    additionalProperties: false
  }
};

export async function processUserMessage(params: {
  message: string;
  emails: Email[];
  currentPage?: string;
  currentEmailId?: string | null;
}): Promise<AIAction> {
  const { message, emails, currentPage, currentEmailId } = params;

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_xai_api_key_here") {
    return {
      action: "clarify",
      question: "xAI API key is missing. Please add your XAI_API_KEY to .env.local to enable real-time Grok mail actions."
    };
  }

  const xai = new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1",
  });

  // Prepare a concise summary of the emails context for the model
  const emailContextList = emails.map(e => ({
    id: e.id,
    sender: e.sender,
    senderName: e.senderName,
    subject: e.subject,
    date: e.date,
    preview: e.preview
  }));

  const userPrompt = `USER REQUEST: "${message}"

CURRENT APP STATE:
- Current Page: ${currentPage || "inbox"}
- Current Opened Email ID: ${currentEmailId || "none"}

AVAILABLE INBOX EMAILS (Sorted newest to oldest):
${JSON.stringify(emailContextList, null, 2)}

Plan and return the exact structured action JSON.`;

  try {
    const model = process.env.XAI_MODEL || "grok-4.3";
    const response = await xai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: actionJsonSchema
      },
      temperature: 0.1
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        action: "clarify",
        question: "Could not generate an action from the Grok assistant. Please try again."
      };
    }

    const raw = JSON.parse(content);
    return sanitizeAction(raw, emails);
  } catch (err: any) {
    console.error("xAI Grok API Error:", err);
    return {
      action: "clarify",
      question: `xAI Grok request failed: ${err.message || "Unknown error"}. Please check your network or xAI API configuration.`
    };
  }
}

/**
 * Validates and converts raw parsed JSON into a strictly typed AIAction
 */
export function sanitizeAction(raw: any, emails: Email[]): AIAction {
  if (!raw || typeof raw !== "object" || !raw.action) {
    return {
      action: "clarify",
      question: "Could not understand the request. Please provide more details."
    };
  }

  switch (raw.action) {
    case "compose":
      return {
        action: "compose",
        to: typeof raw.to === "string" ? raw.to : "",
        subject: typeof raw.subject === "string" ? raw.subject : "",
        body: typeof raw.body === "string" ? raw.body : ""
      };

    case "filter":
      return {
        action: "filter",
        days: typeof raw.days === "number" && raw.days > 0 ? raw.days : 7
      };

    case "open_email": {
      // Validate that the email exists in context
      const id = typeof raw.email_id === "string" ? raw.email_id : "";
      const exists = emails.some(e => e.id === id);
      if (!exists) {
        // If the ID isn't found directly, try fallback check
        return {
          action: "clarify",
          question: `Could not find an email matching that request. Please select an email from the inbox list.`
        };
      }
      return {
        action: "open_email",
        email_id: id
      };
    }

    case "reply":
      return {
        action: "reply",
        email_id: typeof raw.email_id === "string" ? raw.email_id : undefined,
        body: typeof raw.body === "string" ? raw.body : undefined
      };

    case "navigate": {
      const page = ["inbox", "sent", "compose"].includes(raw.page) ? raw.page : "inbox";
      return {
        action: "navigate",
        page: page as "inbox" | "sent" | "compose"
      };
    }

    case "filter_sender":
      return {
        action: "filter_sender",
        sender: typeof raw.sender === "string" ? raw.sender : ""
      };

    case "clarify":
    default:
      return {
        action: "clarify",
        question: typeof raw.question === "string" && raw.question.trim() !== ""
          ? raw.question
          : "Could you please clarify what you would like to do?"
      };
  }
}
