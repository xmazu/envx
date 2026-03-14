import { stripe } from '.';

export async function getPrices() {
  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  });
  return prices.data;
}
