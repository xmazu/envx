import path from 'node:path';
import { execa } from 'execa';
import { SHADCN_COMPONENTS } from '../../lib/constants';
import type { GenerateContext, LogEntry } from '../../lib/types';
import { filterShadcnTooltipMessage } from '../../lib/utils';

export async function* initShadcn(
  ctx: GenerateContext
): AsyncGenerator<LogEntry> {
  yield { message: 'Adding shadcn/ui components...', level: 'spinner' };

  const uiPackageDir = path.join(ctx.targetDir, 'packages', 'ui');

  const runCmd = ctx.packageManager === 'bun' ? 'bunx' : 'pnpm';
  const runArgs =
    ctx.packageManager === 'bun'
      ? ['shadcn@latest', 'add', '-y', '--overwrite', ...SHADCN_COMPONENTS]
      : [
          'exec',
          'shadcn@latest',
          'add',
          '-y',
          '--overwrite',
          ...SHADCN_COMPONENTS,
        ];

  const { stdout, stderr } = await execa(runCmd, runArgs, {
    cwd: uiPackageDir,
  });

  const filteredStdout = filterShadcnTooltipMessage(stdout ?? '');
  if (filteredStdout.length > 0) {
    process.stdout.write(`${filteredStdout}\n`);
  }

  if (stderr && stderr.length > 0) {
    process.stderr.write(`${stderr}\n`);
  }

  yield { message: 'shadcn/ui components added', level: 'success' };
}
