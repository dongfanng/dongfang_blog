import { siteConfig } from '@/config/site';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  pubDate?: Date;
  updatedDate?: Date;
  category?: string;
  tags?: string[];
}

/** 站点绝对 URL（构建时优先用 Astro `site`） */
export const siteUrl = import.meta.env.SITE || siteConfig.url;

/** 构建页面标题：无标题或已是站名时不重复拼接 */
export function buildTitle(title?: string): string {
  if (!title || title === siteConfig.name) return siteConfig.name;
  return `${title} | ${siteConfig.name}`;
}
