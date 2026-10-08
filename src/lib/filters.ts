import type { FilterGroup } from "@/components/FilterBar";
import { PERSONALITY_TAGS, label } from "@/data/taxonomies";

/**
 * Builds a filter group from items, listing only values that occur, in the
 * order of the taxonomy list, with counts.
 */
export function filterGroup<T>(
  key: string,
  title: string,
  order: readonly string[],
  items: T[],
  valuesOf: (item: T) => readonly string[],
  labelOf: (value: string) => string = label,
): FilterGroup {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const v of new Set(valuesOf(item)))
      counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return {
    key,
    label: title,
    options: order
      .filter((v) => counts.has(v))
      .map((v) => ({ value: v, label: labelOf(v), count: counts.get(v)! })),
  };
}

/** The "Feel" filter (personality tags), shared by every browsing page. */
export function feelGroup<T>(
  items: T[],
  tagsOf: (item: T) => readonly string[],
) {
  return filterGroup("feel", "Feel", PERSONALITY_TAGS, items, tagsOf);
}
