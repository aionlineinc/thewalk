import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  providerId: z.string().uuid(),
  memorialId: z.string().uuid(),
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email().max(200),
  customerPhone: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { providerId, memorialId, customerName, customerEmail, customerPhone, description, amount } = parsed.data;

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  // Create the order
  const order = await prisma.ilmServiceOrder.create({
    data: {
      providerId,
      memorialId,
      customerName: customerName.trim(),
      customerEmail,
      customerPhone: customerPhone?.trim() || null,
      description: description?.trim() || null,
      amount,
      status: "PENDING",
    },
  });

  // Create Stripe PaymentIntent
  try {
    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: "usd",
        "metadata[orderId]": order.id,
        "metadata[providerId]": providerId,
        "metadata[memorialId]": memorialId,
      }).toString(),
    });

    const stripeJson = (await stripeRes.json()) as { client_secret?: string; id?: string; error?: { message: string } };

    if (!stripeRes.ok) {
      await prisma.ilmServiceOrder.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      return NextResponse.json({ error: stripeJson.error?.message || "Payment failed" }, { status: 400 });
    }

    await prisma.ilmServiceOrder.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: stripeJson.id, status: "PAID" },
    });

    return NextResponse.json({ clientSecret: stripeJson.client_secret, orderId: order.id });
  } catch {
    await prisma.ilmServiceOrder.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
