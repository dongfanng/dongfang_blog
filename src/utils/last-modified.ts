import { execSync } from 'node:child_process';
import path from 'node:path';

/**
 * 读取内容文件在 git 中的最后提交时间。
 * @param contentId Astro content entry id，如 `2026/getting-started.md`
 */
export function getGitLastModified(contentId: string): Date | null {
  const filepath = path.join(process.cwd(), 'src/content/blog', contentId);
  try {
    const result = execSync(`git log -1 --pretty="format:%cI" -- "${filepath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return result ? new Date(result) : null;
  } catch {
    return null;
  }
}
