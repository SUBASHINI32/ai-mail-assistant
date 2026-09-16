import { NextRequest, NextResponse } from "next/server";
import { processUserMessage } from "@/lib/ai";
import { Email } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, emails, currentPage, currentEmailId } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const emailList: Email[] = Array.isArray(emails) ? emails : [];

    const action = await processUserMessage({
      message,
      emails: emailList,
      currentPage: typeof currentPage === "string" ? currentPage : "inbox",
      currentEmailId: typeof currentEmailId === "string" ? currentEmailId : null,
    });

    return NextResponse.json({ action });
  } catch (error: any) {
    console.error("API /api/ai handler error:", error);
    return NextResponse.json(
      {
        action: {
          action: "clarify",
          question: `An error occurred while processing your request: ${error.message || "Unknown error"}`
        }
      },
      { status: 500 }
    );
  }
}
