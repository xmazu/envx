import { execa } from 'execa';
import type { GenerateContext, LogEntry } from '../../lib/types';

export async function* installDependencies(
  ctx: GenerateContext
): AsyncGenerator<LogEntry> {
  yield {
    message: `Installing dependencies with ${ctx.packageManager}...`,
    level: 'spinner',
  };

  const installCmd = ctx.packageManager === 'bun' ? 'bun' : 'pnpm';
  const installArgs = ctx.packageManager === 'bun' ? ['install'] : ['install'];

  await execa(installCmd, installArgs, {
    cwd: ctx.targetDir,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  yield { message: 'Dependencies installed', level: 'success' };
}
