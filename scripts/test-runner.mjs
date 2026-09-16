import assert from "node:assert";
import { initialEmails, initialSentEmails } from "../data/mockEmails.ts";
import { sanitizeAction } from "../lib/ai.ts";
import { createReplyDraft, describeAIAction, isValidAIAction } from "../lib/actions.ts";

console.log("\n==================================================");
console.log("RUNNING AI MAIL AUTOMATED VERIFICATION SUITE");
console.log("==================================================\n");

// -------------------------------------------------------------
// TEST 1: Mock Data Verification
// -------------------------------------------------------------
console.log(">> Checking Mock Emails Data Model...");
assert(initialEmails.length >= 8, `Expected >= 8 emails, got ${initialEmails.length}`);
console.log(`[PASS] Found ${initialEmails.length} mock inbox emails.`);

const senders = initialEmails.map(e => e.sender);
const requiredSenders = [
  "hari@gmail.com",
  "team@company.com",
  "hr@company.com",
  "professor@college.edu",
  "recruiter@company.com"
];

for (const req of requiredSenders) {
  assert(senders.includes(req), `Missing required sender: ${req}`);
}
console.log(`[PASS] All 5 required senders are present: ${requiredSenders.join(", ")}`);

// -------------------------------------------------------------
// TEST 2: Filter Logic Verification (Last 7 Days)
// -------------------------------------------------------------
console.log("\n>> Testing 7-Day Date Filter Logic...");
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - 7);

const filtered7Days = initialEmails.filter(e => new Date(e.date) >= cutoff);
assert(filtered7Days.length > 0 && filtered7Days.length < initialEmails.length,
  `Filter should reduce email count. Total: ${initialEmails.length}, Filtered: ${filtered7Days.length}`);
console.log(`[PASS] 7-day filter reduces ${initialEmails.length} emails to ${filtered7Days.length} emails.`);

// -------------------------------------------------------------
// TEST 3: Action Schema Sanitization & Validation
// -------------------------------------------------------------
console.log("\n>> Testing AI Action Schema & Validation...");

// Case A: Compose action
const composeRaw = {
  action: "compose",
  to: "hari@gmail.com",
  subject: "Meeting",
  body: "Let's meet tomorrow",
  days: null,
  email_id: null,
  page: null,
  sender: null,
  question: null
};
const composeAction = sanitizeAction(composeRaw, initialEmails);
assert.strictEqual(composeAction.action, "compose");
assert.strictEqual(composeAction.to, "hari@gmail.com");
assert.strictEqual(composeAction.subject, "Meeting");
assert.strictEqual(composeAction.body, "Let's meet tomorrow");
assert(isValidAIAction(composeAction));
console.log(`[PASS] Compose action sanitized properly: ${describeAIAction(composeAction)}`);

// Case B: Filter action (7 days)
const filterRaw = { action: "filter", days: 7, to: null, subject: null, body: null, email_id: null, page: null, sender: null, question: null };
const filterAction = sanitizeAction(filterRaw, initialEmails);
assert.strictEqual(filterAction.action, "filter");
assert.strictEqual(filterAction.days, 7);
console.log(`[PASS] Filter action sanitized properly: ${describeAIAction(filterAction)}`);

// Case C: Open latest email
const sortedEmails = [...initialEmails].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
const latestEmail = sortedEmails[0];
const openLatestRaw = { action: "open_email", email_id: latestEmail.id, to: null, subject: null, body: null, days: null, page: null, sender: null, question: null };
const openAction = sanitizeAction(openLatestRaw, initialEmails);
assert.strictEqual(openAction.action, "open_email");
assert.strictEqual(openAction.email_id, latestEmail.id);
console.log(`[PASS] Open email action validated for newest email ID: ${latestEmail.id}`);

// Case D: Navigate action
const navRaw = { action: "navigate", page: "sent", to: null, subject: null, body: null, days: null, email_id: null, sender: null, question: null };
const navAction = sanitizeAction(navRaw, initialEmails);
assert.strictEqual(navAction.action, "navigate");
assert.strictEqual(navAction.page, "sent");
console.log(`[PASS] Navigate action validated for /sent: ${describeAIAction(navAction)}`);

// Case E: Reply action
const hrEmail = initialEmails.find(e => e.sender === "hr@company.com");
assert(hrEmail, "HR email must exist");
const replyDraft = createReplyDraft(hrEmail, "Thank you for the update.");
assert.strictEqual(replyDraft.to, "hr@company.com");
assert(replyDraft.subject.startsWith("Re:"));
assert(replyDraft.body.includes("Original Message"));
console.log(`[PASS] Reply draft prepared: To ${replyDraft.to} | Subject "${replyDraft.subject}"`);

// Case F: Ambiguous request clarification
const clarifyRaw = { action: "clarify", question: "Who would you like to email and what is the body?", to: null, subject: null, body: null, days: null, email_id: null, page: null, sender: null };
const clarifyAction = sanitizeAction(clarifyRaw, initialEmails);
assert.strictEqual(clarifyAction.action, "clarify");
assert(clarifyAction.question.length > 0);
console.log(`[PASS] Clarification action handled: "${clarifyAction.question}"`);

console.log("\n==================================================");
console.log("ALL LOCAL MODEL, ACTION & SCHEMA TESTS PASSED!");
console.log("==================================================\n");