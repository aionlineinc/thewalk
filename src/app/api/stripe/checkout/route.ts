import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function stripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  // Use the Stripe SDK's default API version (typed to the installed SDK).
  return new Stripe(key);
}

function baseUrl(req: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { priceId?: string; quantity?: number } | null;
  const priceId = body?.priceId;
  const quantity = Math.max(1, Math.min(10, Number(body?.quantity ?? 1)));

  if (!priceId || typeof priceId !== "string") {
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
  }

  try {
    const stripe = stripeClient();
    const site = baseUrl(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity }],
      success_url: `${site}/shop?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/shop?checkout=cancel`,
      automatic_tax: { enabled: false },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe session missing url" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

