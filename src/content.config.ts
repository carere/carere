import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import categoryData from "@/i18n/en/category.json";

const workCategories = categoryData.work.map((cat) => cat.id) as [string, ...string[]];

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/works" }),
  schema: ({ image }) =>
    z.object({
      type: z.enum(workCategories),
      title: z.string(),
      date: z.string(),
      url: z.string().url(),
      image: image(),
    }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/articles" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      author: z.string(),
      date: z.string(),
      image: image(),
      description: z.string(),
      draft: z.boolean().optional().default(false),
      categories: z.array(z.string()).optional().default([]),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/pages" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    noindex: z.boolean().optional(),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/reviews" }),
  schema: ({ image }) =>
    z.object({
      author: z.string(),
      role: z.string(),
      avatar: image(),
    }),
});

export const collections = { works, articles, pages, reviews };
