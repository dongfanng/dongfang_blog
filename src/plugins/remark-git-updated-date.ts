import { execSync } from 'node:child_process';
import path from 'node:path';

/**
 * remark 插件：从 git log 自动注入文章的最后编辑时间
 *
 * 行为：
 * - 只在 frontmatter 没有 updatedDate 时注入（手动填写优先）
 * - git 不可用或文件未跟踪时静默失败，回退到 pubDate
 * - 注入最后一次修改该文件的 commit 时间（committer date，ISO 8601 格式）
 */
export function remarkGitUpdatedDate() {
  return (
    _tree: unknown,
    file: {
      history?: string[];
      data?: { astro?: { frontmatter?: Record<string, unknown> } };
    },
  ) => {
    const frontmatter = file.data?.astro?.frontmatter;
    if (!frontmatter) return;

    // 手动填写的 updatedDate 优先，不覆盖
    if (frontmatter.updatedDate) return;

    const filePath = file.history?.[0];
    if (!filePath) return;

    try {
      const relativePath = path.relative(process.cwd(), filePath);
      const date = execSync(`git log -1 --format=%cI -- "${relativePath}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();

      if (date) {
        frontmatter.updatedDate = date;
      }
    } catch {
      // git 不可用或文件未跟踪，静默失败
    }
  };
}
