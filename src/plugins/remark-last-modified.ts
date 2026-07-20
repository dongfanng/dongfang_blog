import { execSync } from 'node:child_process';

/**
 * remark 插件：用 git log 注入文章最后修改时间
 *
 * 通过 remarkPluginFrontmatter.lastModified 访问。
 * git 不可用或文件从未提交时不写入，页面侧回退到 pubDate。
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

    try {
      const result = execSync(`git log -1 --pretty="format:%cI" -- "${filepath}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      if (result) {
        frontmatter.lastModified = result;
      }
    } catch {
      // git 不可用或文件无提交记录
    }
  };
}
