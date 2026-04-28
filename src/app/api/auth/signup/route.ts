import { NextResponse } from "next/server";
import { identityService } from "@/server/services";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const identity = identityService();
  const result = await identity.signup(json as any);

  if (!result.ok) {
    const e = result.error;
    if (e.kind === "Validation") return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    if (e.kind === "Conflict") return NextResponse.json({ error: e.message }, { status: 409 });
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }

  return NextResponse.json({ user: result.value.user }, { status: 201 });
}

