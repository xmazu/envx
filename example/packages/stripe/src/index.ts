import Stripe from 'stripe';

export function createStripeClient(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
  });
}

export type StripeClient = ReturnType<typeof createStripeClient>;

// biome-ignore lint/performance/noBarrelFile: Template file - barrel exports are intentional for generated projects
export * from './prices';
export * from './webhooks';
