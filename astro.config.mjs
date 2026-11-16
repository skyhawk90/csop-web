// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://csopnasavrky.cz",
  trailingSlash: "ignore",
  integrations: [sitemap({ filter: (page) => !page.includes("/admin") })],
  image: { responsiveStyles: true },
});
