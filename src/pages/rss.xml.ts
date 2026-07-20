import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPosts } from '@/utils/posts';
import { siteConfig } from '@/config/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = sortPosts(posts);

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site ?? '',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
