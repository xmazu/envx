import path from 'node:path';
import fs from 'fs-extra';
import { appendEnvVariables } from '../../lib/templates';
import type { GenerateContext, LogEntry } from '../../lib/types';

async function getDevCommand(
  targetDir: string,
  appName: string,
  packageManager: string
): Promise<string> {
  const packageJsonPath = path.join(targetDir, 'apps', appName, 'package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    return `${packageManager} run dev`;
  }

  const pkg = await fs.readJson(packageJsonPath);
  const devScript = pkg.scripts?.dev;

  if (!devScript) {
    return `${packageManager} run dev`;
  }

  return devScript;
}

export async function* setupEnvironment(
  ctx: GenerateContext
): AsyncGenerator<LogEntry> {
  yield { message: 'Appending environment variables...', level: 'spinner' };
  await appendEnvVariables(ctx.targetDir, ctx.config, ctx.hasOexctl);

  await fs.ensureDir(path.join(ctx.targetDir, '.openenvx'));
  await fs.writeJson(
    path.join(ctx.targetDir, '.openenvx', 'state.json'),
    ctx.state,
    { spaces: 2 }
  );

  yield { message: 'Configuring app runner...', level: 'spinner' };

  const dashboardDev = await getDevCommand(
    ctx.targetDir,
    'dashboard',
    ctx.packageManager
  );
  const webDev = await getDevCommand(ctx.targetDir, 'web', ctx.packageManager);

  const apps = [
    {
      name: 'dashboard',
      cwd: './apps/dashboard',
      command: dashboardDev,
      env: {},
      ...(ctx.config.database !== 'none' ? { depends_on: ['postgres'] } : {}),
    },
    {
      name: 'web',
      cwd: './apps/web',
      command: webDev,
      env: {},
      ...(ctx.config.database !== 'none' ? { depends_on: ['postgres'] } : {}),
    },
  ];

  await fs.writeJson(
    path.join(ctx.targetDir, '.openenvx', 'apps.json'),
    { apps },
    { spaces: 2 }
  );
  yield { message: 'App runner configured', level: 'success' };

  yield { message: 'Environment configured', level: 'success' };
}
