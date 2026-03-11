import path from 'node:path';
import { addPackageDependency } from '../../lib/templates';
import type { GenerateContext, LogEntry } from '../../lib/types';

export async function* addWorkspaceDependencies(
  ctx: GenerateContext
): AsyncGenerator<LogEntry> {
  if (ctx.config.features.stripe) {
    yield {
      message: 'Adding Stripe workspace dependency...',
      level: 'spinner',
    };
    await addPackageDependency(
      path.join(ctx.targetDir, 'apps', 'dashboard', 'package.json'),
      `@${ctx.config.projectName}/stripe`,
      'workspace:*'
    );
  }

  if (ctx.config.features.storage) {
    yield {
      message: 'Adding Storage workspace dependency...',
      level: 'spinner',
    };
    await addPackageDependency(
      path.join(ctx.targetDir, 'apps', 'dashboard', 'package.json'),
      `@${ctx.config.projectName}/storage`,
      'workspace:*'
    );
  }

  if (ctx.config.features.email) {
    yield { message: 'Adding Email workspace dependency...', level: 'spinner' };
    await addPackageDependency(
      path.join(ctx.targetDir, 'apps', 'dashboard', 'package.json'),
      `@${ctx.config.projectName}/email`,
      'workspace:*'
    );
  }

  if (
    ctx.config.features.stripe ||
    ctx.config.features.storage ||
    ctx.config.features.email
  ) {
    yield { message: 'Workspace dependencies added', level: 'success' };
  }
}
