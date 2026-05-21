import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Body = {
  consent_id: string;
  policy_version: number;
  action: "accept_all" | "reject_all" | "custom";
  categories: { necessary: boolean; analytics: boolean; marketing: boolean };
  locale?: string;
};

const VALID_ACTIONS = new Set(["accept_all", "reject_all", "custom"]);

function validate(body: unknown): body is Body {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.consent_id === "string" &&
    /^[0-9a-f-]{36}$/i.test(b.consent_id) &&
    typeof b.policy_version === "number" &&
    Number.isInteger(b.policy_version) &&
    b.policy_version > 0 &&
    typeof b.action === "string" &&
    VALID_ACTIONS.has(b.action) &&
    b.categories !== null &&
    typeof b.categories === "object"
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!validate(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[consent] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return new NextResponse(null, { status: 204 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cookie_consents`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        consent_id: body.consent_id,
        policy_version: body.policy_version,
        action: body.action,
        categories: body.categories,
        locale: body.locale ?? null,
        user_agent: req.headers.get("user-agent") ?? null,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[consent] Supabase insert failed: ${res.status} — ${text}`);
    }
  } catch (err) {
    console.error("[consent] Supabase request error:", err);
  }

  // Always return 204 — the client's consent choice must never be blocked
  // by a persistence failure.
  return new NextResponse(null, { status: 204 });
}
