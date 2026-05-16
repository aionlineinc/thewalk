import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const tierPrices: Record<string, number> = {
  PREMIUM: 8900,    // $89.00
  GENERATIONS: 4900, // $49.00
  CONCIERGE: 29900,  // $299.00
};

const bodySchema = z.object({
  tier: z.enum(["PREMIUM", "GENERATIONS", "CONCIERGE"]),
});

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: Request) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const { tier } = parsed.data;
  const amountCents = tierPrices[tier];
  if (!amountCents) {
    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const origin = req.headers.get("origin") || "http://localhost:3001";

  const purchase = await prisma.ilmPlanPurchase.create({
    data: {
      userId: session.user.id,
      tier,
      status: "PENDING",
    },
  });

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tier === "PREMIUM" ? "Memorial Premium" : tier === "GENERATIONS" ? "Generations Vault" : "Concierge Setup",
              description: tier === "PREMIUM"
                ? "One-time purchase — full memorial features, grief counselling, and more"
                : tier === "GENERATIONS"
                  ? "Annual subscription — private family vault and legacy tools"
                  : "One-time setup — expert builds and populates your memorial",
            },
            unit_amount: amountCents,
            ...(tier === "GENERATIONS" ? { recurring: { interval: "year" } } : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        purchaseId: purchase.id,
        userId: session.user.id,
        tier,
      },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing/cancel`,
    });

    await prisma.ilmPlanPurchase.update({
      where: { id: purchase.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    await prisma.ilmPlanPurchase.update({
      where: { id: purchase.id },
      data: { status: "CANCELLED" },
    });

    const message = err instanceof Error ? err.message : "Checkout session creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
