import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Obsah edituje Sveltia CMS (public/admin/config.yml). Pole tady a tam musí sedět.

const koncept = z.boolean().default(false);

const aktuality = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/aktuality" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      datum: z.coerce.date(),
      perex: z.string(),
      obrazek: image().optional(),
      obrazek_popis: z.string().optional(),
      galerie: reference("galerie").optional(),
      koncept,
    }),
});

const akce = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/akce" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      datum: z.coerce.date(),
      datum_do: z.coerce.date().optional(),
      cas: z.string().optional(),
      misto: z.string().optional(),
      perex: z.string(),
      obrazek: image().optional(),
      odkaz: z.url().optional(),
      koncept,
    }),
});

const galerie = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/galerie" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      datum: z.coerce.date(),
      popis: z.string().optional(),
      fotky: z.array(image()).min(1),
      koncept,
    }),
});

export const collections = { aktuality, akce, galerie };
