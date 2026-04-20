import { NextResponse } from "next/server";

import { CHAT_BOT_CONTEXT } from "@/content/ai-context";
import {
  buildPortfolioSystemPrompt,
  DEFAULT_GEMINI_MODEL,
  generateGeminiReply,
} from "@/lib/gemini-chat";
import { generateNvidiaReply } from "@/lib/nvidia-chat";
import { prisma } from "@/lib/prisma";
import { chatMessageSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  if (!geminiKey && !nvidiaKey) {
    return NextResponse.json(
      {
        error:
          "Chat assistant is not configured (missing both GEMINI_API_KEY and NVIDIA_API_KEY).",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = chatMessageSchema.safeParse(json);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: flat.fieldErrors as Record<string, string[]>,
      },
      { status: 400 },
    );
  }

  const { message } = parsed.data;

  const profile = await prisma.siteProfile.findUnique({
    where: { id: 1 },
    select: { id: true, name: true, chatContext: true },
  });

  const verifiedContext =
    profile?.chatContext?.trim() || CHAT_BOT_CONTEXT;
  const ownerName = profile?.name?.trim() || "Tarun Saini";

  const systemPrompt = buildPortfolioSystemPrompt(
    ownerName,
    verifiedContext,
  );

  /* ---- Primary: Gemini -------------------------------------------------- */
  let result = geminiKey
    ? await generateGeminiReply({
        apiKey: geminiKey,
        model,
        systemPrompt,
        userMessage: message,
      })
    : null;

  /* ---- Fallback: NVIDIA NIM (Gemma 4 31B) ------------------------------- */
  if ((!result || !result.ok) && nvidiaKey) {
    console.warn(
      "[chat] Gemini unavailable — falling back to NVIDIA",
      result && !result.ok ? result.error : "(no Gemini key)",
    );
    result = await generateNvidiaReply({
      apiKey: nvidiaKey,
      systemPrompt,
      userMessage: message,
    });
  }

  if (!result || !result.ok) {
    const error =
      result && !result.ok
        ? result.error
        : "Chat assistant is unavailable.";
    return NextResponse.json({ error }, { status: 502 });
  }

  const siteProfileId = profile?.id ?? 1;

  if (!result.response_returned) {
    try {
      await prisma.unansweredChatQuestion.create({
        data: {
          siteProfileId,
          questionText: message,
        },
      });
    } catch (e) {
      console.error("[chat] could not save unanswered question:", e);
    }
  }

  return NextResponse.json({
    reply: result.reply,
    response_returned: result.response_returned,
  });
}
