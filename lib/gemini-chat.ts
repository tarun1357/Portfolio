/** Server-only Gemini REST helper (no extra npm dependency). */

import { z } from "zod";

/** Default when `GEMINI_MODEL` unset — Gemini 3 Flash (preview id from Google AI docs; falls back if 404). */
export const DEFAULT_GEMINI_MODEL = "gemini-3-flash-preview";

const structuredOutputSchema = z.object({
  reply: z.string(),
  response_returned: z.boolean(),
});

function parseStructuredReply(rawText: string): {
  reply: string;
  response_returned: boolean;
} | null {
  const stripped = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(stripped) as unknown;
    const out = structuredOutputSchema.safeParse(parsed);
    if (out.success) return out.data;
  } catch {
    /* fall through */
  }
  return null;
}

/** When JSON mode fails, detect the canonical refusal line to mark gap questions. */
function fallbackStructuredFromPlainText(text: string): {
  reply: string;
  response_returned: boolean;
} {
  const refusal =
    /don['']t have that detail in my notes/i.test(text) ||
    /reach out through the Contact section/i.test(text);
  return { reply: text.trim(), response_returned: !refusal };
}

function parseGeminiHttpError(status: number, raw: string): string {
  try {
    const j = JSON.parse(raw) as {
      error?: { message?: string; status?: string; code?: number };
    };
    const msg = (j.error?.message ?? "").trim();
    const lower = msg.toLowerCase();

    if (status === 400 || status === 404) {
      if (lower.includes("not found") || lower.includes("is not found")) {
        return "This Gemini model ID isn’t enabled for your API key. The app will try other models automatically; or set GEMINI_MODEL in .env to an id from Google AI Studio → Models (e.g. gemini-3-flash-preview).";
      }
      if (lower.includes("api key") || lower.includes("permission")) {
        return "Gemini rejected the API key—create a key in Google AI Studio and set GEMINI_API_KEY.";
      }
    }
    if (status === 403) {
      return "Gemini denied access (403). Enable the Generative Language API for your Google Cloud project and check the API key.";
    }
    if (status === 429) {
      return "Too many requests—try again in a moment.";
    }

    if (process.env.NODE_ENV === "development" && msg) {
      return msg.length > 280 ? `${msg.slice(0, 280)}…` : msg;
    }
  } catch {
    /* ignore */
  }
  return "Assistant is temporarily unavailable.";
}

export function buildPortfolioSystemPrompt(
  ownerName: string,
  verifiedContext: string,
): string {
  return `You are “Portfolio Assistant”, short factual answers for visitors to ${ownerName}’s personal portfolio website.

RULES (non-negotiable):
1) Use ONLY the VERIFIED CONTEXT block below. Do not invent employers, titles, compensation, dates, teammates, certifications, degrees, awards, repositories, clients, or metrics not literally supported by that block.
2) If the question cannot be answered from VERIFIED CONTEXT, set "reply" to exactly this one sentence (verbatim): I don’t have that detail in my notes—you can reach out through the Contact section on this site. Never guess or speculate.
3) Write clearly and concisely (under ~180 words) when answering from context. Do not role-play as ${ownerName}. Do not claim to browse the web, read email, or access private databases.
4) Decline harmful, harassing, illegal, or explicit requests briefly (still output JSON below).
5) Match the user’s language when reasonable; default to English.

REQUIRED OUTPUT — single JSON object only (no markdown fences, no text before/after):
{"reply":"<string>","response_returned":<true|false>}

Definitions:
- "reply": the exact text the visitor should read (your grounded answer OR the verbatim refusal sentence from rule 2).
- "response_returned": MUST be true only when "reply" is fully grounded in VERIFIED CONTEXT with no reliance on outside knowledge. MUST be false when you use the refusal sentence from rule 2, or when any part of a substantive answer cannot be justified solely from VERIFIED CONTEXT.

VERIFIED CONTEXT:
${verifiedContext}`;
}

export type GeminiGenerateResult =
  | { ok: true; reply: string; response_returned: boolean }
  | { ok: false; error: string; status?: number };

/** Tried after your `GEMINI_MODEL` (deduped) — newer IDs first; Google rotates availability by key/region. */
const MODEL_FALLBACK_CHAIN = [
  "gemini-3-flash-preview",
] as const;

function uniqueModelChain(preferred: string): string[] {
  const raw = [preferred.trim(), ...MODEL_FALLBACK_CHAIN].filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of raw) {
    if (!seen.has(m)) {
      seen.add(m);
      out.push(m);
    }
  }
  return out;
}

async function generateOnce(params: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
}): Promise<GeminiGenerateResult> {
  const url = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(params.model)}:generateContent`,
  );
  url.searchParams.set("key", params.apiKey);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: params.systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: params.userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.25,
        topP: 0.85,
        topK: 40,
        maxOutputTokens: 768,
        responseMimeType: "application/json",
      },
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error("[gemini]", params.model, res.status, raw.slice(0, 1200));
    const detail = parseGeminiHttpError(res.status, raw);
    return {
      ok: false,
      error: detail,
      status: res.status,
    };
  }

  try {
    const json = JSON.parse(raw) as {
      candidates?: {
        content?: { parts?: { text?: string }[] };
        finishReason?: string;
      }[];
      promptFeedback?: { blockReason?: string };
    };

    if (json.promptFeedback?.blockReason) {
      return { ok: false, error: "That request couldn’t be processed." };
    }

    const text =
      json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
      "";

    const trimmed = text.trim();
    if (!trimmed) {
      return { ok: false, error: "No response from the model—try rephrasing." };
    }

    const structured = parseStructuredReply(trimmed);
    if (structured) {
      return {
        ok: true,
        reply: structured.reply,
        response_returned: structured.response_returned,
      };
    }

    const fb = fallbackStructuredFromPlainText(trimmed);
    console.warn("[gemini] unstructured JSON from model — using heuristic parse");
    return { ok: true, reply: fb.reply, response_returned: fb.response_returned };
  } catch {
    return { ok: false, error: "Unexpected response from assistant." };
  }
}

export async function generateGeminiReply(params: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
}): Promise<GeminiGenerateResult> {
  const chain = uniqueModelChain(params.model || DEFAULT_GEMINI_MODEL);

  let last: GeminiGenerateResult = {
    ok: false,
    error:
      "Couldn’t reach Gemini—check GEMINI_API_KEY and https://ai.google.dev/gemini-api/docs/models for valid model IDs.",
    status: 502,
  };

  for (const model of chain) {
    const r = await generateOnce({ ...params, model });
    if (r.ok) return r;

    last = r;

    if (r.status === 401 || r.status === 403 || r.status === 429) {
      return r;
    }

    console.warn("[gemini] model failed, trying next:", model, r.status);
  }

  return last;
}
