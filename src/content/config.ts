import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    sticky: z.number().default(0),
    image: z.union([image(), z.string()]).optional(),
  }),
});

export const collections = { blog };
