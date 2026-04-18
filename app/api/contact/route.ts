import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validations";

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
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO;

  if (key && from && to) {
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
        text: message,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[contact] Resend error", res.status, errText);
      return NextResponse.json(
        { error: "Could not deliver message right now." },
        { status: 502 },
      );
    }
  } else {
    console.info("[contact] dev delivery (configure RESEND)", {
      name,
      email,
      messagePreview: message.slice(0, 160),
    });
  }

  return NextResponse.json({ ok: true });
}
