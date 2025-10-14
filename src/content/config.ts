// src/content/config.ts
import { defineCollection, z } from "astro:content";

const recipes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(), // keep as string if you store in /public
    tags: z.array(z.string()).optional().default([]),

    servings: z.coerce.number().int().optional(),
    prepTimeMins: z.coerce.number().int().optional(),
    cookTimeMins: z.coerce.number().int().optional(),

    ingredients: z.array(z.string()).optional().default([]),
    steps: z.array(z.string()).optional().default([]),

    published: z.coerce.boolean().default(true),
    date: z.coerce.date().optional(), // accepts "2025-10-14" too
  }),
});

export const collections = { recipes };
