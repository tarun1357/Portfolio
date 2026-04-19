import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validations";

export const runtime = "nodejs";

function userFacingResendMessage(status: number, bodyText: string): string {
  try {
    const j = JSON.parse(bodyText) as { message?: string };
    const msg = j.message ?? "";
    if (
      status === 403 &&
      msg.toLowerCase().includes("verify a domain")
    ) {
      return "Email sending isn’t set up for this site yet (verify your domain in Resend and use that domain in CONTACT_FROM).";
    }
    if (
      status === 403 &&
      msg.toLowerCase().includes("only send testing emails")
    ) {
      return "Resend is in testing mode: messages can only go to your Resend account email until you verify a domain.";
    }
    if (status === 422 || status === 400) {
      return "Invalid sender or recipient configuration. Check CONTACT_FROM and CONTACT_TO in your deployment.";
    }
    if (status === 401) {
      return "Email service rejected the API key (check RESEND_API_KEY on the server).";
    }
  } catch {
    /* ignore JSON parse */
  }
  return "Could not deliver message right now.";
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
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

  const { name, email, message } = parsed.data;
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM?.trim();
  const to = process.env.CONTACT_TO?.trim();

  const bodyText = [`From: ${name}`, `Reply-To: ${email}`, "", message].join(
    "\n",
  );

  const configured = Boolean(key && from && to);
  if (!configured) {
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    if (isProd && process.env.VERCEL) {
      console.error("[contact] Missing RESEND_API_KEY, CONTACT_FROM, or CONTACT_TO in production.");
      return NextResponse.json(
        {
          error:
            "Contact form is not configured on this deployment (set RESEND_API_KEY, CONTACT_FROM, CONTACT_TO for Production).",
        },
        { status: 503 },
      );
    }
    console.info("[contact] dev delivery (configure RESEND)", {
      name,
      email,
      messagePreview: message.slice(0, 160),
    });
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[Portfolio] Message from ${name}`,
      reply_to: email,
      text: bodyText,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[contact] Resend error", res.status, errText);
    return NextResponse.json(
      { error: userFacingResendMessage(res.status, errText) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
