/** Internal link with the site's base path (GitHub Pages serves under /design-inspo). */
export function url(path = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const entryUrl = (id: string) => url(`/inspiration/${id}/`);
export const tagUrl = (tag: string) => url(`/tags/${tag}/`);
export const termUrl = (id: string) => url(`/glossary/#${id}`);
