import { NextResponse } from "next/server";
import { groupRegistrationService } from "@/server/services";
import { verifyApiKey } from "@/server/apiKeys";

export async function POST(req: Request) {
  const auth = await verifyApiKey({
    apiKey: req.headers.get("x-api-key"),
    requiredScopes: ["REGISTRATIONS_WRITE"],
  });
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });

  const registrations = groupRegistrationService();
  const result = await registrations.submit(json as any);
  if (!result.ok) {
    const e = result.error;
    if (e.kind === "Validation") return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
    return NextResponse.json({ ok: false, error: "unexpected" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, registrationId: result.value.registrationId }, { status: 201 });
}

