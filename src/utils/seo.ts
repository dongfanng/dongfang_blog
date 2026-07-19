export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  pubDate?: Date;
  updatedDate?: Date;
  category?: string;
  tags?: string[];
}

export const SITE_TITLE = '东方的博客';
export const SITE_DESCRIPTION = '随便写点东西的地方';
export const SITE_URL = import.meta.env.SITE || 'https://blog.example.com';

/**
 * 构建页面标题
 */
export function buildTitle(title?: string): string {
  if (!title) return SITE_TITLE;
  return `${title} | ${SITE_TITLE}`;
}
