// The site's Plausible analytics, added to the head of the pages the site builds
// with Vite: the example pages and the agent kit's demos. The pages Astro builds
// get the same script from src/layouts/Base.astro.
import type { Plugin } from "vite"

export const analytics: Plugin = {
  name: "strict-analytics",
  transformIndexHtml: () => [
    {
      tag: "script",
      attrs: { async: true, src: "https://plausible.io/js/pa-OGnKcX89pjyMgRIXCOrRb.js" },
      injectTo: "head",
    },
    {
      tag: "script",
      children:
        "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()",
      injectTo: "head",
    },
  ],
}
