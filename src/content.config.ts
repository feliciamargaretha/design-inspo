import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import {
  CATEGORIES,
  COLOR_MODES,
  COLOR_ROLES,
  COLOR_TEMPERATURES,
  ENTRY_TYPES,
  IMAGERY_STYLES,
  MOTION_TYPES,
  PERSONALITY_TAGS,
  SCREEN_TYPES,
  TYPE_CLASSIFICATIONS,
  TYPE_ROLES,
} from "./data/taxonomies";

/** A product, e.g. Jira. One product can have several entries (landing, iOS, desktop). */
const products = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/products" }),
  schema: z.object({
    name: z.string(),
    website: z.url(),
    category: z.enum(CATEGORIES),
  }),
});

/** Every breakdown section states what is used and why we think it is used. */
const whatWhy = {
  what: z.string().min(1),
  why: z.string().min(1),
};

const hex = z
  .string()
  .regex(/^#[0-9A-F]{6}$/, "Use uppercase 6-digit hex, e.g. #0061EF");

const mediaItem = z.object({
  /** File name inside public/media/<entry-id>/ */
  src: z.string(),
  kind: z.enum(["image", "video"]).default("image"),
  alt: z.string().min(1),
});

/** One source of inspiration: a landing page, or screens from an iOS / desktop app. */
const entries = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/entries" }),
  schema: z
    .object({
      product: reference("products"),
      type: z.enum(ENTRY_TYPES),
      sourceUrl: z.url(),
      capturedAt: z.coerce.date(),
      /** Thumbnail used on cards (file name inside public/media/<entry-id>/). */
      cover: z.string(),
      /** The full screenshot(s) or recording(s). The first one leads the detail page. */
      media: z.array(mediaItem).min(1),
      /** Required for iOS / desktop, not used for landing pages. */
      screens: z.array(z.enum(SCREEN_TYPES)).default([]),
      tags: z.array(z.enum(PERSONALITY_TAGS)).min(1),

      colors: z.object({
        palette: z
          .array(
            z.object({
              hex,
              name: z.string().optional(),
              role: z.enum(COLOR_ROLES),
            }),
          )
          .min(1),
        mode: z.enum(COLOR_MODES),
        temperature: z.enum(COLOR_TEMPERATURES),
        ...whatWhy,
      }),

      typography: z.object({
        fonts: z
          .array(
            z.object({
              family: z.string(),
              classification: z.enum(TYPE_CLASSIFICATIONS),
              roles: z.array(z.enum(TYPE_ROLES)).min(1),
              /** e.g. "Custom", "Licensed (Colophon)", "Google Fonts" */
              source: z.string().optional(),
            }),
          )
          .min(1),
        ...whatWhy,
      }),

      imagery: z.object({
        styles: z.array(z.enum(IMAGERY_STYLES)).min(1),
        ...whatWhy,
      }),

      /** Only when motion is a notable part of the experience. */
      motion: z
        .object({
          types: z.array(z.enum(MOTION_TYPES)).min(1),
          ...whatWhy,
        })
        .optional(),
    })
    .superRefine((entry, ctx) => {
      if (entry.type === "landing" && entry.screens.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["screens"],
          message: "Landing pages don't use screen types; remove `screens`.",
        });
      }
      if (entry.type !== "landing" && entry.screens.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["screens"],
          message: "iOS / desktop entries need at least one screen type.",
        });
      }
    }),
});

export const collections = { products, entries };
