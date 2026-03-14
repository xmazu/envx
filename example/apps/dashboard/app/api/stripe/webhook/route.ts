import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = await stripe.webhooks.constructEventAsync(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    return Response.json({ received: true, type: event.type });
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
}
