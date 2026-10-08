// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Hosted on GitHub Pages at https://feliciamargaretha.github.io/design-inspo
export default defineConfig({
  site: "https://feliciamargaretha.github.io",
  base: "/design-inspo",
  trailingSlash: "ignore",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
