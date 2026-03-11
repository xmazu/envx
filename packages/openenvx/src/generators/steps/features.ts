import { generateFeature } from '../../lib/templates';
import type { GenerateContext, LogEntry } from '../../lib/types';

export async function* generateFeatures(
  ctx: GenerateContext
): AsyncGenerator<LogEntry> {
  if (ctx.config.features.admin) {
    yield { message: 'Generating Admin feature...', level: 'spinner' };
    await generateFeature(ctx.targetDir, 'admin', ctx.config);
    ctx.state.features.push('admin');
    ctx.state.generated.push('admin');
    yield { message: 'Admin feature generated', level: 'success' };
  }

  if (ctx.config.features.stripe) {
    yield { message: 'Generating Stripe feature...', level: 'spinner' };
    await generateFeature(ctx.targetDir, 'stripe', ctx.config);
    ctx.state.features.push('stripe');
    ctx.state.generated.push('stripe');
    yield { message: 'Stripe feature generated', level: 'success' };
  }

  if (ctx.config.features.storage) {
    yield { message: 'Generating Storage feature...', level: 'spinner' };
    await generateFeature(ctx.targetDir, 'storage', ctx.config);
    ctx.state.features.push('storage');
    ctx.state.generated.push('storage');
    yield { message: 'Storage feature generated', level: 'success' };
  }

  if (ctx.config.features.email) {
    yield { message: 'Generating Email feature...', level: 'spinner' };
    await generateFeature(ctx.targetDir, 'email', ctx.config);
    ctx.state.features.push('email');
    ctx.state.generated.push('email');
    yield { message: 'Email feature generated', level: 'success' };
  }
}
