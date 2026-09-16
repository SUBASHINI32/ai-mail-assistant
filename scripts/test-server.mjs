import assert from "node:assert";

async function runServerTests() {
  const baseUrl = "http://127.0.0.1:3000";
  console.log("\n==================================================");
  console.log("TESTING LIVE NEXT.JS SERVER & API ENDPOINTS");
  console.log("==================================================\n");

  // 1. Test /inbox page
  console.log(">> Testing GET /inbox...");
  const inboxRes = await fetch(`${baseUrl}/inbox`);
  assert.strictEqual(inboxRes.status, 200, "Expected /inbox to return 200");
  const inboxHtml = await inboxRes.text();
  assert(inboxHtml.includes("AI Mail"), "Inbox HTML must include AI Mail branding");
  console.log("[PASS] GET /inbox returned 200 OK and rendered branding.");

  // 2. Test /sent page
  console.log("\n>> Testing GET /sent...");
  const sentRes = await fetch(`${baseUrl}/sent`);
  assert.strictEqual(sentRes.status, 200, "Expected /sent to return 200");
  console.log("[PASS] GET /sent returned 200 OK.");

  // 3. Test /compose page
  console.log("\n>> Testing GET /compose...");
  const composeRes = await fetch(`${baseUrl}/compose`);
  assert.strictEqual(composeRes.status, 200, "Expected /compose to return 200");
  console.log("[PASS] GET /compose returned 200 OK.");

  // 4. Test /email/[id] page
  console.log("\n>> Testing GET /email/email-1...");
  const emailRes = await fetch(`${baseUrl}/email/email-1`);
  assert.strictEqual(emailRes.status, 200, "Expected /email/email-1 to return 200");
  console.log("[PASS] GET /email/email-1 returned 200 OK.");

  // 5. Test POST /api/send
  console.log("\n>> Testing POST /api/send...");
  const sendRes = await fetch(`${baseUrl}/api/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "hari@gmail.com",
      subject: "Meeting Confirmation",
      body: "Sounds good, see you tomorrow at 2 PM."
    })
  });
  assert.strictEqual(sendRes.status, 200, "Expected /api/send to return 200");
  const sendData = await sendRes.json();
  assert.strictEqual(sendData.success, true);
  console.log("[PASS] POST /api/send succeeded:", sendData);

  // 6. Test POST /api/send validation failure
  console.log("\n>> Testing POST /api/send validation on empty body...");
  const sendBadRes = await fetch(`${baseUrl}/api/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: "", subject: "", body: "" })
  });
  assert.strictEqual(sendBadRes.status, 400, "Expected 400 on empty fields");
  console.log("[PASS] POST /api/send validated empty input and returned 400.");

  // 7. Test POST /api/ai
  console.log("\n>> Testing POST /api/ai endpoint...");
  const aiRes = await fetch(`${baseUrl}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Open latest email",
      emails: [],
      currentPage: "inbox",
      currentEmailId: null
    })
  });
  assert.strictEqual(aiRes.status, 200, "Expected /api/ai to return 200");
  const aiData = await aiRes.json();
  assert(aiData.action, "Expected action object in response");
  console.log("[PASS] POST /api/ai returned structured action:", aiData);

  console.log("\n==================================================");
  console.log("ALL SERVER & API ENDPOINT TESTS PASSED!");
  console.log("==================================================\n");
}

runServerTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});