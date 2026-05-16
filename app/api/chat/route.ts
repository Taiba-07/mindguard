import { NextRequest, NextResponse } from "next/server";
import { detectCrisis } from "@/lib/crisis";
import { classifyIntent } from "@/lib/intent";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { ChatMessage } from "@/lib/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function stripPII(text: string): string {
  return text
    .replace(/\b[6-9]\d{9}\b/g, "[phone]")
    .replace(/[\w.+\-]+@[\w\-]+\.\w+/g, "[email]")
    .replace(/\b\d{12}\b/g, "[id]");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastUserText = messages[messages.length - 1]?.content ?? "";

    // Stage 1 — Crisis detection
    if (detectCrisis(lastUserText)) {
      return NextResponse.json({ crisis: true, reply: null });
    }

    // Stage 2 — Strip PII
    const safeMessages = messages.map((m) => ({
      role: m.role,
      content: stripPII(m.content),
    }));

    // Stage 3 — Classify intent
    const intent = classifyIntent(lastUserText);
    const system = buildSystemPrompt(intent);

    // Stage 4 — Call Gemini
    const contents = [
      { role: "user", parts: [{ text: system }] },
      { role: "model", parts: [{ text: "Understood. I am MindGuard, ready to help." }] },
      ...safeMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const geminiData = await geminiRes.json();

    const reply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I am here for you. Can you tell me more about how you are feeling?";

    return NextResponse.json({ reply, intent, crisis: false });
  } catch (err) {
    console.error("[MindGuard API]", err);
    return NextResponse.json(
      { error: "AI temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}