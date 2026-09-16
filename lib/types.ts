export type Email = {
  id: string;
  sender: string;
  senderName: string;
  recipient: string;
  subject: string;
  preview: string;
  body: string;
  date: string; // ISO 8601 string or standard formatted date string
  read: boolean;
};

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

export type ComposeDraft = {
  to: string;
  subject: string;
  body: string;
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: AIAction;
  timestamp: string;
};

export type InboxFilter = {
  days?: number;
  sender?: string;
} | null;
