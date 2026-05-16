import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeInstance } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

function getWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || null;
}

export async function POST(req: Request) {
  const stripe = getStripeInstance();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  const webhookSecret = getWebhookSecret();
  let event: Stripe.Event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    // Without webhook secret (local dev), parse the raw event without verification.
    // WARNING: Do not expose this to the internet without a webhook secret.
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid event body" }, { status: 400 });
    }
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const purchaseId = checkoutSession.metadata?.purchaseId;
      const userId = checkoutSession.metadata?.userId;
      const tier = checkoutSession.metadata?.tier;

      if (!purchaseId || !userId || !tier) {
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      const amountPaid = checkoutSession.amount_total
        ? Number((checkoutSession.amount_total / 100).toFixed(2))
        : null;

      await prisma.ilmPlanPurchase.update({
        where: { id: purchaseId },
        data: {
          status: "ACTIVE",
          stripePaymentIntentId: checkoutSession.payment_intent as string | null,
          amountPaid,
          activatedAt: new Date(),
          ...(tier === "GENERATIONS"
            ? { expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
            : {}),
        },
      });

      return NextResponse.json({ received: true });
    }

    case "checkout.session.expired": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const purchaseId = checkoutSession.metadata?.purchaseId;
      if (purchaseId) {
        await prisma.ilmPlanPurchase.update({
          where: { id: purchaseId },
          data: { status: "CANCELLED" },
        });
      }
      return NextResponse.json({ received: true });
    }

    default:
      return NextResponse.json({ received: true });
  }
}
