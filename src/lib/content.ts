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
