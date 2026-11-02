import { z } from "zod";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s().-]*$/;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).refine((value) => EMAIL_PATTERN.test(value), "Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((value) => {
      if (!value) return true;
      const digits = value.replace(/\D/g, "").length;
      return PHONE_PATTERN.test(value) && digits >= 7 && digits <= 15;
    }, "Enter a valid phone number"),
  company: z.string().trim().max(120),
  message: z.string().trim().min(1).max(3000),
  source: z.string().trim().max(100).optional(),
  submittedAt: z.string().trim().max(40).optional(),
  website: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const scriptUrl = process.env.CONTACT_SCRIPT_URL;
  if (!scriptUrl) {
    return Response.json({ ok: false, error: "Contact form is not configured" }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_384) {
    return Response.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Invalid form submission" }, { status: 400 });
  }

  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result || result.ok !== true) {
      return Response.json({ ok: false, error: "Unable to send your message" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Unable to send your message" }, { status: 502 });
  }
}
