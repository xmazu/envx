import { Resend } from 'resend';

export function createEmailClient(apiKey: string) {
  return new Resend(apiKey);
}

export type EmailClient = Resend;

// biome-ignore lint/performance/noBarrelFile: Template file - barrel exports are intentional for generated projects
export * from './templates';
