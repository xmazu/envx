import type { LogEntry, ProjectConfig } from '../lib/types';
import {
  checkOexctlInstalled,
  detectPackageManager,
  installOexctl,
} from '../lib/utils';
import { createContext } from './context';
import { generateBase } from './steps/base';
import { installDependencies } from './steps/dependencies';
import { createProjectDirectory } from './steps/directory';
import { setupEnvironment } from './steps/environment';
import { generateFeatures } from './steps/features';
import { initGit } from './steps/git';
import { initShadcn } from './steps/shadcn';
import { addWorkspaceDependencies } from './steps/workspace';

export type { ProjectConfig } from '../lib/types';

export async function* generateProject(
  config: ProjectConfig
): AsyncGenerator<LogEntry, void, unknown> {
  const packageManager = await detectPackageManager();
  yield { message: `Using package manager: ${packageManager}`, level: 'info' };

  let hasOexctl = checkOexctlInstalled();
  if (hasOexctl) {
    yield {
      message: 'oexctl detected - configuring proxy URLs',
      level: 'info',
    };
  } else {
    yield {
      message: 'oexctl not detected - attempting automatic installation...',
      level: 'spinner',
    };

    const installed = await installOexctl();
    if (installed) {
      hasOexctl = true;
      yield {
        message: 'oexctl installed successfully - configuring proxy URLs',
        level: 'success',
      };
    } else {
      yield {
        message: 'oexctl installation failed - using fallback ports',
        level: 'warning',
      };
      yield {
        message: 'Install manually: openenvx install',
        level: 'info',
      };
    }
  }

  const ctx = createContext(config, packageManager, hasOexctl);

  yield* createProjectDirectory(ctx);
  yield* generateBase(ctx);
  yield* generateFeatures(ctx);
  yield* setupEnvironment(ctx);
  yield* addWorkspaceDependencies(ctx);
  yield* installDependencies(ctx);
  yield* initShadcn(ctx);
  yield* initGit(ctx);
}
