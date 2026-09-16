import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json();

    if (!to || typeof to !== "string" || !to.trim()) {
      return NextResponse.json({ error: "Recipient ('to') is required." }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    }

    if (!body || typeof body !== "string" || !body.trim()) {
      return NextResponse.json({ error: "Body is required." }, { status: 400 });
    }

    // In-memory simulation: successfully validate and return ok
    return NextResponse.json({
      success: true,
      message: "Email queued and sent successfully.",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API /api/send handler error:", error);
    return NextResponse.json(
      { error: "Failed to process send request." },
      { status: 500 }
    );
  }
}
