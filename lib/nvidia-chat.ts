/**
 * Server-only NVIDIA NIM fallback for the portfolio chat.
 * Uses the OpenAI-compatible /v1/chat/completions endpoint
 * with google/gemma-4-31b-it hosted on NVIDIA's API catalog.
 */

import type { GeminiGenerateResult } from "./gemini-chat";

const NVIDIA_INVOKE_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";

/** Default NVIDIA model — Gemma 4 31B Instruct via NIM. */
export const DEFAULT_NVIDIA_MODEL = "google/gemma-4-31b-it";

/** Parse the structured JSON reply the same way as the Gemini module. */
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
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "reply" in parsed &&
      "response_returned" in parsed
    ) {
      const obj = parsed as { reply: unknown; response_returned: unknown };
      if (typeof obj.reply === "string" && typeof obj.response_returned === "boolean") {
        return { reply: obj.reply, response_returned: obj.response_returned };
      }
    }
  } catch {
    /* fall through */
  }
  return null;
}

/** Heuristic fallback when JSON mode fails. */
function fallbackStructuredFromPlainText(text: string): {
  reply: string;
  response_returned: boolean;
} {
  const refusal =
    /don['']t have that detail in my notes/i.test(text) ||
    /reach out through the Contact section/i.test(text);
  return { reply: text.trim(), response_returned: !refusal };
}

/**
 * Call NVIDIA NIM (OpenAI-compatible) with the same system + user prompt
 * used by the Gemini path.
 *
 * Streams are consumed internally; the function returns a single result
 * exactly matching `GeminiGenerateResult` so the chat route can use it
 * as a drop-in fallback.
 */
export async function generateNvidiaReply(params: {
  apiKey: string;
  model?: string;
  systemPrompt: string;
  userMessage: string;
}): Promise<GeminiGenerateResult> {
  const model = params.model || DEFAULT_NVIDIA_MODEL;

  try {
    const res = await fetch(NVIDIA_INVOKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.25,
        top_p: 0.85,
        stream: false,
      }),
    });

    const raw = await res.text();

    if (!res.ok) {
      console.error("[nvidia]", model, res.status, raw.slice(0, 1200));

      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          error:
            "NVIDIA API key is invalid or missing—set NVIDIA_API_KEY in .env.",
          status: res.status,
        };
      }
      if (res.status === 429) {
        return {
          ok: false,
          error: "Too many requests to NVIDIA—try again shortly.",
          status: 429,
        };
      }
      return {
        ok: false,
        error: "NVIDIA assistant is temporarily unavailable.",
        status: res.status,
      };
    }

    const json = JSON.parse(raw) as {
      choices?: {
        message?: { content?: string };
        finish_reason?: string;
      }[];
    };

    const text = json.choices?.[0]?.message?.content?.trim() ?? "";

    if (!text) {
      return {
        ok: false,
        error: "No response from NVIDIA model—try rephrasing.",
      };
    }

    // Strip <think>…</think> reasoning blocks that Gemma may emit
    const cleaned = text
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .trim();

    const finalText = cleaned || text;

    const structured = parseStructuredReply(finalText);
    if (structured) {
      return {
        ok: true,
        reply: structured.reply,
        response_returned: structured.response_returned,
      };
    }

    // Try to extract JSON from mixed text (Gemma sometimes wraps it)
    const jsonMatch = finalText.match(/\{[\s\S]*"reply"\s*:[\s\S]*\}/);
    if (jsonMatch) {
      const extracted = parseStructuredReply(jsonMatch[0]);
      if (extracted) {
        console.warn(
          "[nvidia] extracted JSON from mixed response — using that",
        );
        return {
          ok: true,
          reply: extracted.reply,
          response_returned: extracted.response_returned,
        };
      }
    }

    console.warn("[nvidia] unstructured response — using heuristic parse");
    const fb = fallbackStructuredFromPlainText(finalText);
    return { ok: true, reply: fb.reply, response_returned: fb.response_returned };
  } catch (err) {
    console.error("[nvidia] fetch error:", err);
    return {
      ok: false,
      error: "Failed to reach NVIDIA API.",
      status: 502,
    };
  }
}
