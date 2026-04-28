import { NextResponse } from "next/server";
import { groupRegistrationService } from "@/server/services";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const registrations = groupRegistrationService();
  const result = await registrations.submit(json as any);
  if (!result.ok) {
    const e = result.error;
    if (e.kind === "Validation") return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: "Could not submit registration" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
