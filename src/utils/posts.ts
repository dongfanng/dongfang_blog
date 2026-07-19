import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/**
 * 统计正文字数（去除代码块、行内代码与空白字符）
 */
export function getWordCount(body: string): number {
  const text = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  return text.replace(/\s/g, '').length;
}

/**
 * 估算阅读时间(分钟)
 * 移除代码块后按 ~400 字/分钟计算
 */
export function getReadingTime(body: string): number {
  const charCount = getWordCount(body);
  return Math.max(1, Math.ceil(charCount / 400));
}

/**
 * 排序文章：置顶优先（sticky 越大越靠前），然后按日期降序
 */
export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => {
      if (a.data.sticky !== b.data.sticky) {
        return b.data.sticky - a.data.sticky;
      }
      return b.data.pubDate.getTime() - a.data.pubDate.getTime();
    });
}

/**
 * 获取所有分类
 */
export function getCategories(posts: BlogPost[]): string[] {
  const categories = new Set<string>();
  posts.forEach((post) => {
    if (!post.data.draft) {
      categories.add(post.data.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * 获取所有标签
 */
export function getTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    if (!post.data.draft) {
      post.data.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

/**
 * 按年份分组文章（用于归档）
 */
export function groupPostsByYear(posts: BlogPost[]): Map<number, BlogPost[]> {
  const grouped = new Map<number, BlogPost[]>();
  posts.forEach((post) => {
    if (!post.data.draft) {
      const year = post.data.pubDate.getFullYear();
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(post);
    }
  });
  // 对每年的文章进行排序（降序）
  grouped.forEach((yearPosts) => {
    yearPosts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  });
  // 按年份降序排列
  return new Map([...grouped.entries()].sort(([a], [b]) => b - a));
}

/**
 * 获取相关文章（基于相同标签）
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxCount: number = 3
): BlogPost[] {
  const currentTags = new Set(currentPost.data.tags);

  return allPosts
    .filter((post) => {
      if (post.slug === currentPost.slug || post.data.draft) return false;
      // 计算共同标签数量
      const commonTags = post.data.tags.filter((tag) => currentTags.has(tag));
      return commonTags.length > 0;
    })
    .sort((a, b) => {
      // 按共同标签数量排序
      const aCommon = a.data.tags.filter((tag) => currentTags.has(tag)).length;
      const bCommon = b.data.tags.filter((tag) => currentTags.has(tag)).length;
      if (aCommon !== bCommon) return bCommon - aCommon;
      // 标签数量相同时按日期排序
      return b.data.pubDate.getTime() - a.data.pubDate.getTime();
    })
    .slice(0, maxCount);
}

/**
 * 获取上一篇和下一篇文章
 */
export function getPrevNextPosts(
  currentPost: BlogPost,
  sortedPosts: BlogPost[]
): { prev: BlogPost | null; next: BlogPost | null } {
  const index = sortedPosts.findIndex((post) => post.slug === currentPost.slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: sortedPosts[index + 1] || null,
    next: sortedPosts[index - 1] || null,
  };
}
