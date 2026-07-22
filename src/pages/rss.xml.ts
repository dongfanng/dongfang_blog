import rss from '@astrojs/rss';
import { getPublishedPosts, sortPosts } from '@/utils/posts';
import { siteConfig } from '@/config/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
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
      author: siteConfig.author,
    })),
  });
}
