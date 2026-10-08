import {
  COLOR_HARMONY_TERMS,
  COLOR_STRATEGY_TERMS,
  GLOSSARY,
  IMAGERY_STYLE_TERMS,
  IMAGERY_TREATMENT_TERMS,
  MOTION_TERMS,
  TEXTURE_TERMS,
  TYPE_STYLE_TERMS,
  type Term,
} from "@/data/glossary";
import { termUrl } from "@/lib/url";

/** Glossary groups, in the order the glossary page shows them. */
export const TERM_GROUPS = [
  { id: "color-harmony", title: "Color harmony", terms: COLOR_HARMONY_TERMS },
  {
    id: "color-strategy",
    title: "Color strategy",
    terms: COLOR_STRATEGY_TERMS,
  },
  { id: "type-style", title: "Type classification", terms: TYPE_STYLE_TERMS },
  { id: "imagery-style", title: "Imagery style", terms: IMAGERY_STYLE_TERMS },
  {
    id: "imagery-treatment",
    title: "Image treatment",
    terms: IMAGERY_TREATMENT_TERMS,
  },
  { id: "texture", title: "Texture", terms: TEXTURE_TERMS },
  { id: "motion", title: "Motion technique", terms: MOTION_TERMS },
] as const;

/** Serializable term data for the Terms island. */
export interface TermProps extends Term {
  id: string;
  href: string;
}

export function term(id: string): TermProps {
  const t = GLOSSARY[id];
  if (!t) throw new Error(`Unknown glossary term "${id}"`);
  return { id, href: termUrl(id), ...t };
}

export const terms = (ids: readonly string[]) => ids.map(term);
