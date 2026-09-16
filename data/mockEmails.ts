import { Email } from "@/lib/types";

// Helper to generate ISO dates relative to now so date-based filtering always works reliably
const daysAgo = (days: number, hoursOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hoursOffset);
  return date.toISOString();
};

export const initialEmails: Email[] = [
  {
    id: "email-1",
    sender: "team@company.com",
    senderName: "Engineering Team",
    recipient: "me@company.com",
    subject: "Q3 Roadmap and Sprint Planning Updates",
    preview: "Hi everyone, here are the finalized deliverables for the upcoming sprint, including AI Mail integration...",
    body: "Hi Team,\n\nHere are the finalized deliverables for our upcoming sprint. We are focusing heavily on shipping the new AI Mail assistant capabilities and refining the client-side UI controller.\n\nKey priorities:\n1. Finish structured output schema validation with OpenAI.\n2. Ensure zero regex fallback for natural language commands.\n3. Verify that Compose, Inbox filters, and email reply routing work seamlessly.\n\nPlease review the attached sprint board before tomorrow's standup at 10:00 AM.\n\nBest,\nEngineering Leads",
    date: daysAgo(0, 2), // Today, 2 hours ago
    read: false,
  },
  {
    id: "email-2",
    sender: "hr@company.com",
    senderName: "HR Department",
    recipient: "me@company.com",
    subject: "Annual Performance Reviews & Benefits Enrollment",
    preview: "Reminder: Open enrollment for health benefits closes this Friday. Also, 360-degree self-assessments are now open...",
    body: "Hello,\n\nThis is a friendly reminder that open enrollment for next year's health, wellness, and dental benefits closes this Friday at 5:00 PM EST.\n\nAdditionally, the Q3 self-reflection form is now active on the internal portal. Please take 20 minutes to submit your achievements and growth goals for next quarter.\n\nIf you have questions, please reach out to hr@company.com or schedule office hours with our people operations team.\n\nWarm regards,\nPeople Operations & HR",
    date: daysAgo(1, 4), // 1 day ago
    read: false,
  },
  {
    id: "email-3",
    sender: "hari@gmail.com",
    senderName: "Hariharan R",
    recipient: "me@company.com",
    subject: "Project Sync & Architecture Review",
    preview: "Hey, are you free for a quick chat regarding the client state management architecture? We should sync soon...",
    body: "Hey there,\n\nAre you free for a quick chat regarding the client state management architecture? We should sync up on how the AI Mail assistant executes frontend actions without page reloads.\n\nI tested the prototype and the responsiveness is great. Let's meet tomorrow or later this week whenever you have 15 minutes free.\n\nThanks,\nHari",
    date: daysAgo(3, 1), // 3 days ago
    read: false,
  },
  {
    id: "email-4",
    sender: "professor@college.edu",
    senderName: "Prof. Alan Turing",
    recipient: "me@company.com",
    subject: "Research Paper Review Feedback & Revisions",
    preview: "I have gone over the latest draft of your paper on autonomous UI control agents. The methodology looks solid...",
    body: "Dear Student,\n\nI have carefully reviewed the latest revision of your research paper titled 'Deterministic UI Manipulation via LLM Structured Action Sequences'.\n\nThe separation between LLM intent planning and the deterministic frontend dispatcher is well argued. Please add empirical benchmarks comparing structured outputs versus free-form text parsers before final submission.\n\nRegards,\nProf. Turing\nDepartment of Computer Science",
    date: daysAgo(5, 6), // 5 days ago (still within last 7 days)
    read: true,
  },
  {
    id: "email-5",
    sender: "recruiter@company.com",
    senderName: "Tech Talent Team",
    recipient: "me@company.com",
    subject: "Next Steps: Staff AI Systems Engineer Role",
    preview: "Thank you for taking the time to speak with our engineering director yesterday. The team was very impressed...",
    body: "Hi,\n\nThank you for taking the time to speak with our engineering director yesterday. The team was very impressed by your experience building agentic systems and intuitive frontend architectures.\n\nWe would love to invite you to our virtual onsite loop. Please share your availability for next Tuesday and Wednesday.\n\nBest regards,\nSarah Connor\nPrincipal Talent Partner",
    date: daysAgo(10, 2), // 10 days ago (outside 7 days)
    read: true,
  },
  {
    id: "email-6",
    sender: "security@company.com",
    senderName: "Security Operations",
    recipient: "me@company.com",
    subject: "Notice: Multi-Factor Authentication (MFA) Policy Update",
    preview: "Beginning next month, hardware security keys or authenticator apps will be required for all internal tools...",
    body: "Hello,\n\nAs part of our continuous security enhancements, SMS-based verification will be phased out by the end of this month. All team members must configure FIDO2 WebAuthn keys or an authenticator app (TOTP).\n\nPlease visit security.company.internal/mfa-setup to verify your backup devices.\n\nSecurity Operations Team",
    date: daysAgo(16, 5), // 16 days ago
    read: true,
  },
  {
    id: "email-7",
    sender: "hari@gmail.com",
    senderName: "Hariharan R",
    recipient: "me@company.com",
    subject: "Weekend plans and catching up",
    preview: "Hey! Let me know if you are around this weekend for some tennis or coffee...",
    body: "Hey!\n\nJust checking in to see if you are free this coming Saturday morning for tennis or just coffee. Let me know when you get a chance.\n\nCheers,\nHari",
    date: daysAgo(21, 3), // 21 days ago
    read: true,
  },
  {
    id: "email-8",
    sender: "newsletter@techdaily.com",
    senderName: "Tech Daily Digest",
    recipient: "me@company.com",
    subject: "Weekly AI Digest: The Evolution of Autonomous UI Agents",
    preview: "In this week's issue: Why structured output schemas are replacing brittle chatbot wrappers in modern applications...",
    body: "Welcome to Tech Daily Digest #482!\n\nTop stories this week:\n- Autonomous UI Agents: Why modern applications are using LLMs as state planners rather than conversational chatbots.\n- OpenAI Structured Outputs: Guaranteed JSON conforming to JSON Schema.\n- Next.js App Router performance patterns for in-memory reactive shells.\n\nThanks for reading,\nThe Tech Daily Editorial Team",
    date: daysAgo(27, 4), // 27 days ago
    read: true,
  }
];

export const initialSentEmails: Email[] = [
  {
    id: "sent-1",
    sender: "me@company.com",
    senderName: "Me",
    recipient: "team@company.com",
    subject: "Weekly Progress Report - AI Mail Assistant",
    preview: "Hi team, attached is the weekly progress report highlighting the completed AI controller...",
    body: "Hi team,\n\nAttached is the weekly progress report highlighting the completed AI controller. All tests are passing and the UI executes actions cleanly.\n\nBest,\nMe",
    date: daysAgo(4, 3),
    read: true,
  }
];
