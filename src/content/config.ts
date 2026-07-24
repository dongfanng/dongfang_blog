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
    /** 系列名称（同名即同系列） */
    series: z.string().trim().min(1).optional(),
    /** 系列内排序（越小越靠前；缺省则按 pubDate 升序） */
    seriesOrder: z.number().optional(),
  }),
});

export const collections = { blog };
