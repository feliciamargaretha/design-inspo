import { existsSync } from "node:fs";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Entry = CollectionEntry<"entries">;
export type Product = CollectionEntry<"products">;
export type EntryWithProduct = Entry & { productData: Product };

/** Public URL of a media file belonging to an entry. */
export function mediaUrl(entryId: string, file: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/media/${entryId}/${file}`;
}

function assertMediaExists(entry: Entry): void {
  const { colors, typography, imagery, motion } = entry.data;
  const files = [
    entry.data.cover,
    ...[
      entry.data.media,
      colors.examples,
      typography.examples,
      imagery.examples,
      motion?.examples ?? [],
    ].flatMap((items) => items.map((m) => m.src)),
    ...typography.fonts.flatMap((f) => (f.specimen ? [f.specimen] : [])),
  ];
  for (const file of files) {
    const path = `./public/media/${entry.id}/${file}`;
    if (!existsSync(path)) {
      throw new Error(`Entry "${entry.id}": missing media file ${path}`);
    }
  }
}

/** All entries, newest first, with their product attached and media checked. */
export async function getEntries(): Promise<EntryWithProduct[]> {
  const entries = await getCollection("entries");
  const withProducts = await Promise.all(
    entries.map(async (entry) => {
      assertMediaExists(entry);
      const productData = await getEntry(entry.data.product);
      if (!productData) {
        throw new Error(
          `Entry "${entry.id}": unknown product "${entry.data.product.id}"`,
        );
      }
      return { ...entry, productData };
    }),
  );
  return withProducts.sort(
    (a, b) => b.data.capturedAt.getTime() - a.data.capturedAt.getTime(),
  );
}

export interface ExampleRef {
  entry: EntryWithProduct;
  section: "imagery" | "motion";
  src: string;
  alt: string;
  caption?: string;
  terms: string[];
}

/** Every imagery and motion example across entries, with its entry. */
export function allExamples(entries: EntryWithProduct[]): ExampleRef[] {
  return entries.flatMap((entry) => [
    ...entry.data.imagery.examples.map((ex) => ({
      entry,
      section: "imagery" as const,
      ...ex,
    })),
    ...(entry.data.motion?.examples ?? []).map((ex) => ({
      entry,
      section: "motion" as const,
      ...ex,
    })),
  ]);
}

export type LibraryFont = CollectionEntry<"fonts">;

/** Media folder for a library font: public/media/fonts/<id>/. */
export const fontMediaId = (id: string) => `fonts/${id}`;

/** Font library, newest first, with notes checked for leftover TODOs. */
export async function getFonts(): Promise<LibraryFont[]> {
  const fonts = await getCollection("fonts");
  for (const font of fonts) {
    if (font.body?.includes("TODO")) {
      throw new Error(`Font "${font.id}": TODO left in the notes.`);
    }
    for (const file of [font.data.specimen, font.data.preview]) {
      if (!file) continue;
      const path = `./public/media/fonts/${font.id}/${file}`;
      if (!existsSync(path))
        throw new Error(`Font "${font.id}": missing ${path}`);
    }
  }
  return fonts.sort(
    (a, b) => b.data.addedAt.getTime() - a.data.addedAt.getTime(),
  );
}

/** Google Fonts stylesheet URL for the given families and weights. */
export function googleFontsHref(
  fonts: { family: string; weights: number[] }[],
): string {
  const families = fonts
    .map(
      (f) =>
        `family=${encodeURIComponent(f.family).replace(/%20/g, "+")}:wght@${[...new Set(f.weights)].sort((a, b) => a - b).join(";")}`,
    )
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
