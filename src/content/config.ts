import { defineCollection, z } from "astro:content";
const recipes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // will default from filename
    description: z.string().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    servings: z.number().int().optional(),
    prepTimeMins: z.number().int().optional(),
    cookTimeMins: z.number().int().optional(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    published: z.boolean().default(true),
    date: z.string().optional(), // ISO or yyyy-mm-dd
  }),
});

export const collections = { recipes };
