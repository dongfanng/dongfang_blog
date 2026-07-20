import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/** 已发布文章（统一过滤 draft，草稿不会出现在列表/归档/静态路径中） */
export async function getPublishedPosts() {
  return getCollection('blog', ({ data }) => !data.draft);
}

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
  return [...posts].sort((a, b) => {
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
  const categories = new Set(posts.map((post) => post.data.category));
  return Array.from(categories).sort();
}

/**
 * 获取所有标签
 */
export function getTags(posts: BlogPost[]): string[] {
  const tags = new Set(posts.flatMap((post) => post.data.tags));
  return Array.from(tags).sort();
}

/**
 * 按年份分组文章（用于归档）
 */
export function groupPostsByYear(posts: BlogPost[]): Map<number, BlogPost[]> {
  const grouped = new Map<number, BlogPost[]>();
  posts.forEach((post) => {
    const year = post.data.pubDate.getFullYear();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)!.push(post);
  });
  grouped.forEach((yearPosts) => {
    yearPosts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  });
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
      if (post.slug === currentPost.slug) return false;
      return post.data.tags.some((tag) => currentTags.has(tag));
    })
    .sort((a, b) => {
      const aCommon = a.data.tags.filter((tag) => currentTags.has(tag)).length;
      const bCommon = b.data.tags.filter((tag) => currentTags.has(tag)).length;
      if (aCommon !== bCommon) return bCommon - aCommon;
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
