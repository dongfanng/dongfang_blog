import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';

/**
 * remark 插件：自动注入文章的最后修改时间
 *
 * 策略：
 * - 优先用 git log 获取最后 commit 时间
 * - 如果文件有未提交修改（mtime > commit 时间）或 git 不可用，用文件系统 mtime
 *
 * 通过 remarkPluginFrontmatter.lastModified 访问，不与 schema 中的字段冲突。
 * Astro content collection 自动缓存，不需要手动缓存。
 */
export function remarkLastModified() {
  return (
    _tree: unknown,
    file: {
      history?: string[];
      data?: { astro?: { frontmatter?: Record<string, unknown> } };
    },
  ) => {
    const filepath = file.history?.[0];
    if (!filepath) return;

    const frontmatter = file.data?.astro?.frontmatter;
    if (!frontmatter) return;

    const mtime = statSync(filepath).mtime;

    let commitTime: Date | null = null;
    try {
      const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      if (result) {
        commitTime = new Date(result);
      }
    } catch {
      // git 不可用
    }

    // 有未提交修改（mtime > commitTime）或 git 不可用 -> 用 mtime
    if (!commitTime || mtime > commitTime) {
      frontmatter.lastModified = mtime.toISOString();
    } else {
      frontmatter.lastModified = commitTime.toISOString();
    }
  };
}
