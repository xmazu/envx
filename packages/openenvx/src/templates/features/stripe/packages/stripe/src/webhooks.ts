import { stripe } from ".";

export async function handleWebhook(payload: string, signature: string) {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  switch (event.type) {
    case "invoice.payment_succeeded":
      // Handle successful payment
      break;
    case "customer.subscription.deleted":
      // Handle subscription cancellation
      break;
  }

  return event;
}
