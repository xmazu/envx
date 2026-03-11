import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

/**
 * Rolldown plugin to copy static assets
 */
export function copy(options) {
  const { from, to } = options;

  return {
    name: 'copy',
    async buildStart() {
      const sourcePath = resolve(from);
      const targetPath = resolve(to);

      await copyRecursive(sourcePath, targetPath);
    },
  };
}

async function copyRecursive(src, dest) {
  const stats = await stat(src);

  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);

    for (const entry of entries) {
      const srcPath = join(src, entry);
      const destPath = join(dest, entry);
      await copyRecursive(srcPath, destPath);
    }
  } else {
    // biome-ignore lint/performance/useTopLevelRegex: this is a regex
    await mkdir(dest.replace(/\/[^/]+$/, ''), { recursive: true });
    await copyFile(src, dest);
  }
}
