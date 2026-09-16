import { AIAction, Email, ComposeDraft } from "./types";

/**
 * Returns a clean, user-friendly descriptive summary of an executed AI action
 */
export function describeAIAction(action: AIAction): string {
  switch (action.action) {
    case "compose":
      return `Populated Compose draft for ${action.to || "recipient"}`;
    case "filter":
      return `Filtered inbox to emails within the last ${action.days} days`;
    case "open_email":
      return `Opened email with ID ${action.email_id}`;
    case "reply":
      return `Prepared reply draft to ${action.email_id ? `email ${action.email_id}` : "current email"}`;
    case "navigate":
      return `Navigated to ${action.page.toUpperCase()} view`;
    case "filter_sender":
      return `Filtered inbox by sender "${action.sender}"`;
    case "clarify":
      return `Requested clarification from user`;
    default:
      return "Executed AI action";
  }
}

/**
 * Prepares a reply draft based on the original email
 */
export function createReplyDraft(originalEmail: Email, customBody?: string): ComposeDraft {
  const subjectPrefix = originalEmail.subject.toLowerCase().startsWith("re:")
    ? originalEmail.subject
    : `Re: ${originalEmail.subject}`;

  const originalQuote = `\n\n--- Original Message ---\nFrom: ${originalEmail.senderName} <${originalEmail.sender}>\nDate: ${new Date(originalEmail.date).toLocaleString()}\nSubject: ${originalEmail.subject}\n\n${originalEmail.body}`;

  return {
    to: originalEmail.sender,
    subject: subjectPrefix,
    body: customBody ? `${customBody}${originalQuote}` : originalQuote,
  };
}

/**
 * Validates that an object conforms to the AIAction structure
 */
export function isValidAIAction(obj: any): obj is AIAction {
  if (!obj || typeof obj !== "object" || typeof obj.action !== "string") {
    return false;
  }
  const validActions = ["compose", "filter", "open_email", "reply", "navigate", "filter_sender", "clarify"];
  return validActions.includes(obj.action);
}
