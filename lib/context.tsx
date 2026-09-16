"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Email, AIAction, ComposeDraft, AssistantMessage, InboxFilter } from "./types";
import { initialEmails, initialSentEmails } from "@/data/mockEmails";
import { createReplyDraft, describeAIAction } from "./actions";

interface MailContextType {
  emails: Email[];
  sentEmails: Email[];
  inboxFilter: InboxFilter;
  composeDraft: ComposeDraft;
  currentEmailId: string | null;
  currentEmail: Email | null;
  filteredEmails: Email[];
  unreadCount: number;
  aiMessages: AssistantMessage[];
  isAiLoading: boolean;
  aiError: string | null;
  notification: { message: string; type: "success" | "info" | "error" } | null;
  setComposeDraft: React.Dispatch<React.SetStateAction<ComposeDraft>>;
  setInboxFilter: React.Dispatch<React.SetStateAction<InboxFilter>>;
  clearFilter: () => void;
  setCurrentEmailId: (id: string | null) => void;
  markAsRead: (id: string) => void;
  sendEmail: (draft: ComposeDraft) => Promise<boolean>;
  discardDraft: () => void;
  executeAIAction: (action: AIAction) => void;
  submitUserCommand: (command: string) => Promise<void>;
  dismissNotification: () => void;
}

const MailContext = createContext<MailContextType | undefined>(undefined);

export function MailProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [sentEmails, setSentEmails] = useState<Email[]>(initialSentEmails);
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>(null);
  const [composeDraft, setComposeDraft] = useState<ComposeDraft>({
    to: "",
    subject: "",
    body: "",
  });
  const [currentEmailId, setCurrentEmailId] = useState<string | null>(null);

  const [aiMessages, setAiMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Hello! I am your AI Mail Assistant. You can give me natural language commands to control the Mail UI — such as composing drafts, filtering emails by date or sender, opening emails, or navigating.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  // Derive current open email
  const currentEmail = useMemo(() => {
    if (!currentEmailId) return null;
    return emails.find((e) => e.id === currentEmailId) || null;
  }, [emails, currentEmailId]);

  // Derive filtered emails for Inbox view
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      if (!inboxFilter) return true;

      // Filter by days
      if (typeof inboxFilter.days === "number" && inboxFilter.days > 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - inboxFilter.days);
        const emailDate = new Date(email.date);
        if (emailDate < cutoffDate) {
          return false;
        }
      }

      // Filter by sender
      if (inboxFilter.sender && inboxFilter.sender.trim() !== "") {
        const query = inboxFilter.sender.toLowerCase();
        const matchesSender =
          email.sender.toLowerCase().includes(query) ||
          email.senderName.toLowerCase().includes(query);
        if (!matchesSender) {
          return false;
        }
      }

      return true;
    });
  }, [emails, inboxFilter]);

  const unreadCount = useMemo(() => {
    return emails.filter((e) => !e.read).length;
  }, [emails]);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const dismissNotification = () => setNotification(null);

  const clearFilter = () => {
    setInboxFilter(null);
    showToast("Filter cleared. Showing all emails.", "info");
  };

  const markAsRead = (id: string) => {
    setEmails((prev) =>
      prev.map((email) => (email.id === id ? { ...email, read: true } : email))
    );
  };

  const discardDraft = () => {
    setComposeDraft({ to: "", subject: "", body: "" });
    showToast("Draft discarded", "info");
    router.push("/inbox");
  };

  const sendEmail = async (draft: ComposeDraft): Promise<boolean> => {
    if (!draft.to.trim()) {
      showToast("Recipient is required", "error");
      return false;
    }
    if (!draft.subject.trim()) {
      showToast("Subject is required", "error");
      return false;
    }
    if (!draft.body.trim()) {
      showToast("Email body is required", "error");
      return false;
    }

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) {
        throw new Error("Failed to send email");
      }

      const newSentEmail: Email = {
        id: `sent-${Date.now()}`,
        sender: "me@company.com",
        senderName: "Me",
        recipient: draft.to,
        subject: draft.subject,
        preview: draft.body.slice(0, 80) + (draft.body.length > 80 ? "..." : ""),
        body: draft.body,
        date: new Date().toISOString(),
        read: true,
      };

      setSentEmails((prev) => [newSentEmail, ...prev]);
      setComposeDraft({ to: "", subject: "", body: "" });
      showToast("Email sent successfully!", "success");
      router.push("/sent");
      return true;
    } catch (err: any) {
      showToast(err.message || "Failed to send email", "error");
      return false;
    }
  };

  /**
   * CRITICAL UI CONTROLLER:
   * Interprets and executes structured AI actions on the frontend
   */
  const executeAIAction = (action: AIAction) => {
    switch (action.action) {
      case "compose": {
        setComposeDraft({
          to: action.to || "",
          subject: action.subject || "",
          body: action.body || "",
        });
        showToast("Compose form pre-filled by AI", "info");
        router.push("/compose");
        break;
      }

      case "filter": {
        setInboxFilter({ days: action.days });
        showToast(`Inbox filtered: Showing last ${action.days} days`, "info");
        router.push("/inbox");
        break;
      }

      case "open_email": {
        markAsRead(action.email_id);
        setCurrentEmailId(action.email_id);
        router.push(`/email/${action.email_id}`);
        break;
      }

      case "reply": {
        const targetId = action.email_id || currentEmailId;
        const targetEmail = emails.find((e) => e.id === targetId);

        if (targetEmail) {
          const draft = createReplyDraft(targetEmail, action.body);
          setComposeDraft(draft);
          showToast(`Prepared reply to ${targetEmail.senderName}`, "info");
          router.push("/compose");
        } else {
          // If no specific email is open, inform the user
          setAiMessages((prev) => [
            ...prev,
            {
              id: `clarify-${Date.now()}`,
              role: "assistant",
              content: "Which email would you like to reply to? Please open an email first or specify the sender.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
        break;
      }

      case "navigate": {
        router.push(`/${action.page}`);
        break;
      }

      case "filter_sender": {
        setInboxFilter({ sender: action.sender });
        showToast(`Inbox filtered: sender containing "${action.sender}"`, "info");
        router.push("/inbox");
        break;
      }

      case "clarify": {
        // Only update the assistant chat, DO NOT change the mail UI
        break;
      }
    }
  };

  const submitUserCommand = async (command: string) => {
    if (!command.trim() || isAiLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: command,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);
    setAiError(null);

    // Extract current page path
    const pageSegment = pathname.split("/")[1] || "inbox";

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: command,
          emails,
          currentPage: pageSegment,
          currentEmailId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to process AI command");
      }

      const data: { action: AIAction } = await res.json();
      const action = data.action;

      let assistantContent = "";
      if (action.action === "clarify") {
        assistantContent = action.question;
      } else {
        assistantContent = describeAIAction(action);
      }

      const aiMsg: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: assistantContent,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setAiMessages((prev) => [...prev, aiMsg]);

      // Visibly execute the action on the Mail UI
      executeAIAction(action);
    } catch (err: any) {
      console.error("AI action execution failed:", err);
      setAiError(err.message || "Failed to contact AI service");
      setAiMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `Error: ${err.message || "Unable to reach AI service."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <MailContext.Provider
      value={{
        emails,
        sentEmails,
        inboxFilter,
        composeDraft,
        currentEmailId,
        currentEmail,
        filteredEmails,
        unreadCount,
        aiMessages,
        isAiLoading,
        aiError,
        notification,
        setComposeDraft,
        setInboxFilter,
        clearFilter,
        setCurrentEmailId,
        markAsRead,
        sendEmail,
        discardDraft,
        executeAIAction,
        submitUserCommand,
        dismissNotification,
      }}
    >
      {children}
    </MailContext.Provider>
  );
}

export function useMail() {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error("useMail must be used within a MailProvider");
  }
  return context;
}
