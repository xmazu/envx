import fs from 'fs-extra';
import type { GenerateContext, LogEntry } from '../../lib/types';

export async function* createProjectDirectory(
  ctx: GenerateContext
): AsyncGenerator<LogEntry> {
  if (await fs.pathExists(ctx.targetDir)) {
    throw new Error(`Directory "${ctx.config.name}" already exists`);
  }

  yield { message: 'Creating project directory...', level: 'spinner' };
  await fs.ensureDir(ctx.targetDir);
  yield { message: 'Project directory created', level: 'success' };
}
